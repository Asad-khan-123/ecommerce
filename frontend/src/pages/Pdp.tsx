import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';

/* ─────────────────────────────────────────────────────────────
   Accordion Item
───────────────────────────────────────────────────────────── */
interface AccordionItem {
  title: string;
  content: string;
}

const Accordion = ({
  items,
  open,
  onToggle,
}: {
  items: AccordionItem[];
  open: string | null;
  onToggle: (t: string) => void;
}) => (
  <div className="mt-10 divide-y divide-[#E8E8E8] border-t border-[#E8E8E8]">
    {items.map((item) => (
      <div key={item.title}>
        <button
          onClick={() => onToggle(item.title)}
          className="flex w-full items-center justify-between py-4 text-left"
        >
          <span className="text-[12px] tracking-wide text-[#212121] uppercase">{item.title}</span>
          <ChevronDown
            size={16}
            className={`flex-shrink-0 text-[#212121] transition-transform duration-300 ${
              open === item.title ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            open === item.title ? 'max-h-[500px] pb-4' : 'max-h-0'
          }`}
        >
          <p className="text-[12px] leading-relaxed text-[#555] whitespace-pre-line">{item.content}</p>
        </div>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────────────────────────── */
const PdpSkeleton = () => (
  <div className="mx-auto max-w-[1440px] animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="grid gap-1">
        <div className="aspect-[3/4] bg-[#EBEBEB]" />
        <div className="aspect-[3/4] bg-[#E4E4E4]" />
      </div>
      <div className="space-y-6 px-6 py-10 lg:px-24 lg:py-16">
        <div className="h-3 w-1/4 rounded bg-[#E0E0E0]" />
        <div className="h-6 w-3/4 rounded bg-[#E0E0E0]" />
        <div className="h-4 w-1/3 rounded bg-[#E0E0E0]" />
        <div className="mt-8 space-y-4">
          <div className="h-12 rounded bg-[#EBEBEB]" />
          <div className="h-12 rounded bg-[#EBEBEB]" />
          <div className="h-12 rounded bg-[#EBEBEB]" />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Main PDP Component
───────────────────────────────────────────────────────────── */
const Pdp = () => {
  const { slug } = useParams<{ slug: string }>();
  const { fetchProductBySlug } = useProducts();

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details'>('description');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  /* Fetch product on slug change */
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    setQuantity(1);
    setAddedToCart(false);

    fetchProductBySlug(slug).then((p) => {
      if (!p) {
        setNotFound(true);
      } else {
        setProduct(p);
        setSelectedSize(''); // Force user selection
        setSelectedColor(p.colors?.[0] || '');
        setValidationError(null);
      }
      setLoading(false);
    });
  }, [slug, fetchProductBySlug]);

  /* Fetch related products from the same category with fallback */
  useEffect(() => {
    if (!product) return;

    const fetchRelated = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        
        // Step 1: Try to fetch products matching same menuItem AND subMenuItemId
        const params = new URLSearchParams();
        if (product.menuItem) {
          const mId = typeof product.menuItem === 'object' && product.menuItem !== null
            ? product.menuItem._id
            : product.menuItem;
          params.append('menuItem', mId);
        }
        if (product.subMenuItemId) {
          params.append('subMenuItemId', product.subMenuItemId);
        }
        params.append('limit', '10');

        let res = await fetch(`${apiBase}/products?${params.toString()}`);
        let data = await res.json();
        let list: Product[] = [];

        if (data.success && data.data) {
          list = data.data.filter((p: Product) => p._id !== product._id);
        }

        // Step 2: Fallback to same parent menuItem if list has less than 4 products
        if (list.length < 4 && product.menuItem) {
          const mId = typeof product.menuItem === 'object' && product.menuItem !== null
            ? product.menuItem._id
            : product.menuItem;
          
          const fallbackParams = new URLSearchParams();
          fallbackParams.append('menuItem', mId);
          fallbackParams.append('limit', '12');

          const fallbackRes = await fetch(`${apiBase}/products?${fallbackParams.toString()}`);
          const fallbackData = await fallbackRes.json();

          if (fallbackData.success && fallbackData.data) {
            const fallbackList = fallbackData.data.filter((p: Product) => p._id !== product._id);
            // Combine list, avoiding duplicates
            const combined = [...list];
            fallbackList.forEach((item: Product) => {
              if (!combined.some(existing => existing._id === item._id)) {
                combined.push(item);
              }
            });
            list = combined;
          }
        }

        // Step 3: Fallback to any active products if list still has less than 4 products
        if (list.length < 4) {
          const generalParams = new URLSearchParams();
          generalParams.append('limit', '12');

          const generalRes = await fetch(`${apiBase}/products?${generalParams.toString()}`);
          const generalData = await generalRes.json();

          if (generalData.success && generalData.data) {
            const generalList = generalData.data.filter((p: Product) => p._id !== product._id);
            const combined = [...list];
            generalList.forEach((item: Product) => {
              if (!combined.some(existing => existing._id === item._id)) {
                combined.push(item);
              }
            });
            list = combined;
          }
        }

        setRelatedProducts(list.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch related products:', err);
      }
    };

    fetchRelated();
  }, [product]);

  /* Recently Viewed products tracking */
  useEffect(() => {
    if (!product) return;

    try {
      const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
      let list: Product[] = savedRecentlyViewed ? JSON.parse(savedRecentlyViewed) : [];

      // Filter out current product to avoid duplicates
      list = list.filter((p) => p._id !== product._id);

      // Prepend current product
      list.unshift(product);

      // Truncate to maximum 5 items
      list = list.slice(0, 5);

      localStorage.setItem('recentlyViewed', JSON.stringify(list));
    } catch (error) {
      console.error('Failed to update recently viewed list:', error);
    }
  }, [product]);


  const handleAddToCart = () => {
    if (!product) return;

    if (!user) {
      // Must be logged in to add to cart
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setValidationError('Please select a size');
      return;
    }

    setValidationError(null);
    addToCart({
      _id: product._id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || '',
      size: selectedSize,
      color: selectedColor || 'Default',
      quantity: quantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setValidationError('Please select a size to proceed');
      return;
    }

    setValidationError(null);
    navigate(`/checkout?productId=${product.slug}&size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(selectedColor || 'Default')}&qty=${quantity}`);
  };

  /* ── Not Found ── */
  if (notFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center font-['Poppins'] text-[#212121]">
        <p className="text-[13px] tracking-widest uppercase text-[#999]">Product not found</p>
        <Link
          to="/"
          className="mt-6 border border-[#212121] px-6 py-2 text-[11px] tracking-widest uppercase text-[#212121] transition-colors hover:bg-[#212121] hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) return <PdpSkeleton />;

  if (!product) return null;

  const accordionData: AccordionItem[] = [
    {
      title: 'Fabric & Materials',
      content: product.fabricMaterials || '',
    },
    {
      title: 'Size on Model',
      content: product.sizeModel || '',
    },
    {
      title: 'Fit & Construction',
      content: product.fitConstruction || '',
    },
    {
      title: 'Shipping & Returns',
      content: product.shippingReturns || '',
    },
  ];

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="bg-white font-['Poppins'] text-[#212121]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* ── LEFT: Image Gallery ── */}
          <div className="lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)] lg:overflow-y-auto pb-6">
            <div className="relative">
              {product.images.length > 0 ? (
                <div className="relative w-full aspect-[3/4] bg-[#F5F5F5]">
                  <img
                    src={product.images[activeImage]}
                    alt={`${product.title} — view ${activeImage + 1}`}
                    className="w-full h-full object-cover animate-fade-in"
                  />
                  {/* Discount badge */}
                  {discount && (
                    <span className="absolute left-4 top-4 bg-[#212121] px-2 py-[2px] text-[10px] tracking-widest uppercase text-white z-10">
                      -{discount}%
                    </span>
                  )}
                  {/* Out of stock */}
                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                      <span className="bg-white px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase text-[#212121]">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-[#F5F5F5]">
                  <span className="text-[11px] tracking-widest uppercase text-[#999]">No Image</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip - for both Desktop & Mobile (shows other images small) */}
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-4 px-4 lg:px-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-20 w-16 flex-shrink-0 overflow-hidden border transition-all duration-200 ${
                      activeImage === idx 
                        ? 'border-[#212121] scale-102' 
                        : 'border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Details ── */}
          <div className="px-6 py-10 lg:px-[80px] lg:py-16">
            <div className="max-w-[480px]">

              {/* Breadcrumb */}
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[11px] tracking-wide text-[#999] transition-colors hover:text-[#212121]"
              >
                <ArrowLeft size={12} />
                All Products
              </Link>

              {/* Title */}
              <h1 className="mt-5 text-[22px] font-light leading-tight tracking-tight text-[#212121]">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-[16px] text-[#212121]">
                  ₹ {product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-[14px] text-[#999] line-through">
                    ₹ {product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discount && (
                  <span className="text-[11px] tracking-wider text-[#888]">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Stock status */}
              <p className={`mt-1.5 text-[11px] tracking-wide ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? `In Stock${product.inventory > 0 ? ` — ${product.inventory} left` : ''}` : 'Out of Stock'}
              </p>

              {/* ── Variants ── */}
              <div className="mt-8 space-y-6">

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-[11px] tracking-widest uppercase text-[#212121]">
                        Size
                      </label>
                      <span className="text-[11px] tracking-wide text-[#999]">{selectedSize}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setValidationError(null);
                          }}
                          className={`h-9 min-w-[42px] border px-3 text-[11px] tracking-widest uppercase transition-all ${
                            selectedSize === size
                              ? 'border-[#212121] bg-[#212121] text-white'
                              : 'border-[#D8D8D8] text-[#212121] hover:border-[#212121]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-[11px] tracking-widest uppercase text-[#212121]">
                        Color
                      </label>
                      <span className="text-[11px] tracking-wide text-[#999]">{selectedColor}</span>
                    </div>
                    <div className="relative">
                      <select
                        value={selectedColor}
                        onChange={(e) => {
                          setSelectedColor(e.target.value);
                          setValidationError(null);
                        }}
                        className="w-full appearance-none border border-[#D8D8D8] bg-white px-4 py-3 text-[12px] text-[#212121] focus:border-[#212121] focus:outline-none"
                      >
                        {product.colors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#212121]"
                      />
                    </div>
                  </div>
                )}

                {/* Validation Error Message */}
                {validationError && (
                  <p className="text-[11px] font-medium text-red-500 tracking-wide mt-2">
                    {validationError}
                  </p>
                )}

                {/* Quantity + Add to Cart */}
                <div className="flex gap-3 pt-2">
                  <div className="flex items-center border border-[#D8D8D8]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-12 w-10 items-center justify-center text-[#212121] transition-colors hover:bg-[#F5F5F5]"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-[12px] text-[#212121]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-12 w-10 items-center justify-center text-[#212121] transition-colors hover:bg-[#F5F5F5]"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 text-[11px] tracking-[0.2em] uppercase transition-all ${
                      addedToCart
                        ? 'bg-green-700 text-white'
                        : product.inStock
                        ? 'bg-[#1a1a1a] text-white hover:bg-black'
                        : 'cursor-not-allowed bg-[#D8D8D8] text-[#999]'
                    }`}
                  >
                    {addedToCart ? '✓ Added' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>

                {/* Buy Now */}
                {product.inStock && (
                  <button
                    onClick={handleBuyNow}
                    className="w-full mt-3 border border-[#212121] py-3.5 text-[11px] tracking-[0.2em] uppercase text-[#212121] hover:bg-[#212121] hover:text-white transition-colors duration-200"
                  >
                    Buy Now
                  </button>
                )}

                {/* WhatsApp Link */}
                <p className="text-[11px] text-[#999]">
                  Need a tailored fit?{' '}
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#212121] underline underline-offset-2 hover:text-black"
                  >
                    Connect on WhatsApp
                  </a>
                </p>
              </div>

              {/* ── Tabs: Description / Details ── */}
              <div className="mt-12 border-b border-[#E8E8E8]">
                <div className="flex gap-8">
                  {(['description', 'details'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-[11px] tracking-[0.15em] uppercase transition-colors ${
                        activeTab === tab
                          ? 'border-b border-[#212121] text-[#212121]'
                          : 'text-[#999] hover:text-[#212121]'
                      }`}
                    >
                      {tab === 'description' ? 'Description' : 'Details & Care'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-6 text-[12px] leading-relaxed text-[#555]">
                {activeTab === 'description' ? (
                  <p>{product.description || 'No description available for this product.'}</p>
                ) : (
                  <ul className="space-y-2">
                    {product.sizes?.length > 0 && (
                      <li><span className="font-medium text-[#212121]">Available Sizes:</span> {product.sizes.join(', ')}</li>
                    )}
                    {product.colors?.length > 0 && (
                      <li><span className="font-medium text-[#212121]">Available Colors:</span> {product.colors.join(', ')}</li>
                    )}
                    {product.inStock !== undefined && (
                      <li><span className="font-medium text-[#212121]">Availability:</span> {product.inStock ? 'In Stock' : 'Out of Stock'}</li>
                    )}
                    {product.inventory > 0 && (
                      <li><span className="font-medium text-[#212121]">Units Left:</span> {product.inventory}</li>
                    )}
                  </ul>
                )}
              </div>

              {/* ── Accordion ── */}
              <Accordion
                items={accordionData}
                open={openAccordion}
                onToggle={(t) => setOpenAccordion(openAccordion === t ? null : t)}
              />

            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="bg-white font-['Poppins']">
          <div className="mx-auto w-full">
            {/* Section Heading */}
            <div className="border-t border-[#E8E8E8] py-12 text-center bg-white">
              <h2 className="text-[12px] font-normal tracking-[0.3em] uppercase text-[#212121]">
                Related Products
              </h2>
            </div>
            {/* 4 Products Grid - Zero Gap 431-88 Style */}
            <div className="grid grid-cols-2 gap-0 lg:grid-cols-4 bg-white border-y border-[#E8E8E8]">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recently Viewed Products */}
      <RecentlyViewed />
    </div>
  );
};

export default Pdp;