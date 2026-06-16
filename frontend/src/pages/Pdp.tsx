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
            open === item.title ? 'max-h-40 pb-4' : 'max-h-0'
          }`}
        >
          <p className="text-[12px] leading-relaxed text-[#555]">{item.content}</p>
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
  const { fetchProductBySlug, products, fetchProducts } = useProducts();

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

  /* Fetch related products (all products, exclude current) */
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts({ limit: 8 });
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    if (product && products.length > 0) {
      setRelatedProducts(
        products.filter((p) => p._id !== product._id).slice(0, 4)
      );
    }
  }, [product, products]);

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

  const accordionData: AccordionItem[] = [
    {
      title: 'Fabric & Materials',
      content:
        'Crafted from premium quality materials selected for durability and comfort. Each piece undergoes rigorous quality checks before reaching you.',
    },
    {
      title: 'Size on Model',
      content: "Our model is 6'1\" and wearing a size M. The fit is true to size — we recommend ordering your usual size.",
    },
    {
      title: 'Fit & Construction',
      content:
        'Relaxed fit with structured shoulders for a clean silhouette. Designed to layer or wear standalone.',
    },
    {
      title: 'Shipping & Returns',
      content:
        'Free shipping on orders over ₹2,000. Rs. 150 shipping fee otherwise. Returns accepted within 14 days of delivery in original condition. See our full returns policy for details.',
    },
  ];

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

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="bg-white font-['Poppins'] text-[#212121]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* ── LEFT: Image Gallery ── */}
          <div className="lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)] lg:overflow-y-auto">
            {/* Mobile: single large image + thumbnails */}
            <div className="relative">
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[activeImage]}
                    alt={`${product.title} — view ${activeImage + 1}`}
                    className="w-full object-cover"
                    style={{ aspectRatio: '3/4' }}
                  />
                  {/* Discount badge */}
                  {discount && (
                    <span className="absolute left-4 top-4 bg-[#212121] px-2 py-[2px] text-[10px] tracking-widest uppercase text-white">
                      -{discount}%
                    </span>
                  )}
                  {/* Out of stock */}
                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="bg-white px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase text-[#212121]">
                        Sold Out
                      </span>
                    </div>
                  )}
                  {/* Thumbnail strip (hidden on desktop — desktop shows stacked) */}
                  {product.images.length > 1 && (
                    <div className="flex gap-1.5 p-3 lg:hidden">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`h-14 w-10 flex-shrink-0 overflow-hidden border transition-all ${
                            activeImage === idx ? 'border-[#212121]' : 'border-transparent opacity-60'
                          }`}
                        >
                          <img src={img} alt={`thumb ${idx + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-[#F5F5F5]">
                  <span className="text-[11px] tracking-widest uppercase text-[#999]">No Image</span>
                </div>
              )}
            </div>

            {/* Desktop: stacked images */}
            {product.images.length > 1 && (
              <div className="hidden lg:grid lg:grid-cols-1 lg:gap-1">
                {product.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.title} view ${idx + 2}`}
                    className="w-full object-cover"
                    style={{ aspectRatio: '3/4' }}
                  />
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

              {/* ── You May Also Like ── */}
              {relatedProducts.length > 0 && (
                <div className="mt-14 border-t border-[#E8E8E8] pt-10">
                  <h3 className="mb-6 text-[11px] tracking-[0.3em] uppercase text-[#212121]">
                    You May Also Like
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {relatedProducts.slice(0, 2).map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Full-width Related Products ── */}
      {relatedProducts.length > 2 && (
        <div className="border-t border-[#E8E8E8] px-6 py-16 sm:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-[18px] font-light tracking-tight text-[#212121]">
                Complete the Look
              </h2>
              <Link
                to="/"
                className="text-[11px] tracking-wide text-[#999] underline underline-offset-4 hover:text-[#212121]"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recently Viewed Products */}
      <RecentlyViewed currentProductId={product._id} />
    </div>
  );
};

export default Pdp;