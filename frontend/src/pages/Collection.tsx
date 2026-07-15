import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import RecentlyViewed from '../components/RecentlyViewed';
import type { Product } from '../context/ProductContext';

const PRODUCTS_PER_PAGE = 12;

const Collection = () => {
  const { menuSlug, itemSlug } = useParams<{ menuSlug: string; itemSlug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter & Sort States
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'newest'>('featured');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Price states
  const [priceMinInput, setPriceMinInput] = useState('');
  const [priceMaxInput, setPriceMaxInput] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Dropdown visibility
  const [activeDropdown, setActiveDropdown] = useState<'size' | 'color' | 'availability' | 'price' | 'sort' | null>(null);

  // Sync state when menuSlug or itemSlug changes (reset all filters and page)
  useEffect(() => {
    handleClearAll();
  }, [menuSlug, itemSlug]);

  useEffect(() => {
    fetchProducts();
  }, [menuSlug, itemSlug, currentPage, selectedSizes, selectedColors, inStockOnly, sortBy, priceMin, priceMax]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      let url = itemSlug
        ? `${API_BASE_URL}/collections/${menuSlug}/${itemSlug}`
        : `${API_BASE_URL}/collections/${menuSlug}`;

      const params = new URLSearchParams();
      params.append('page', String(currentPage));
      params.append('limit', String(PRODUCTS_PER_PAGE));

      if (selectedSizes.length > 0) {
        params.append('sizes', selectedSizes.join(','));
      }
      if (selectedColors.length > 0) {
        params.append('colors', selectedColors.join(','));
      }
      if (inStockOnly) {
        params.append('inStock', 'true');
      }
      if (priceMin) {
        params.append('priceMin', priceMin);
      }
      if (priceMax) {
        params.append('priceMax', priceMax);
      }
      if (sortBy !== 'featured') {
        params.append('sort', sortBy);
      }

      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
        setPageTitle(data.pageTitle || menuSlug);
        setTotalProducts(data.total || 0);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
    setPriceMinInput('');
    setPriceMaxInput('');
    setPriceMin('');
    setPriceMax('');
    setSortBy('featured');
    setCurrentPage(1);
    setActiveDropdown(null);
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    inStockOnly ||
    priceMin !== '' ||
    priceMax !== '';

  return (
    <div className="min-h-screen bg-white font-['Poppins'] flex flex-col">
      {/* Invisible backdrop click catcher to close dropdowns */}
      {activeDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
      )}

      {/* Collection Header */}
      <div className="border-b border-[#E8E8E8] bg-white py-12">
        <div className="mx-auto max-w-[1440px] px-8">
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-light tracking-tight text-[#212121]">
            {pageTitle}
          </h1>
          <p className="mt-3 text-[12px] tracking-wide text-[#999]">
            {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}
          </p>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="border-b border-[#E8E8E8] bg-white py-4 relative z-20">
        <div className="mx-auto max-w-[1440px] px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[10px] tracking-widest text-[#212121] uppercase">
          
          {/* Left Side: Filter Options */}
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-gray-400">FILTER BY:</span>
            
            {/* Size Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'size' ? null : 'size')}
                className="flex items-center gap-1.5 hover:underline transition-all"
              >
                SIZE {selectedSizes.length > 0 && `(${selectedSizes.length})`} 
                <ChevronDown size={10} className={`transition-transform duration-200 ${activeDropdown === 'size' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'size' && (
                <div className="absolute left-0 mt-2.5 w-48 bg-white border border-[#E8E8E8] p-4 shadow-lg z-30 space-y-2.5">
                  {['XS', 'S', 'M', 'L', 'XL', 'Free Size'].map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer normal-case tracking-normal text-xs text-[#212121]">
                      <input 
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        className="rounded border-gray-300 text-[#212121] focus:ring-[#212121] h-3.5 w-3.5"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Color Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
                className="flex items-center gap-1.5 hover:underline transition-all"
              >
                COLOR {selectedColors.length > 0 && `(${selectedColors.length})`} 
                <ChevronDown size={10} className={`transition-transform duration-200 ${activeDropdown === 'color' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'color' && (
                <div className="absolute left-0 mt-2.5 w-48 bg-white border border-[#E8E8E8] p-4 shadow-lg z-30 space-y-2.5">
                  {['black', 'blue', 'red', 'white', 'grey', 'green', 'beige'].map((color) => (
                    <label key={color} className="flex items-center gap-2 cursor-pointer normal-case tracking-normal text-xs text-[#212121] capitalize">
                      <input 
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => handleColorToggle(color)}
                        className="rounded border-gray-300 text-[#212121] focus:ring-[#212121] h-3.5 w-3.5"
                      />
                      {color}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Availability Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'availability' ? null : 'availability')}
                className="flex items-center gap-1.5 hover:underline transition-all"
              >
                AVAILABILITY {inStockOnly && '(1)'} 
                <ChevronDown size={10} className={`transition-transform duration-200 ${activeDropdown === 'availability' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'availability' && (
                <div className="absolute left-0 mt-2.5 w-56 bg-white border border-[#E8E8E8] p-4 shadow-lg z-30">
                  <label className="flex items-center gap-2 cursor-pointer normal-case tracking-normal text-xs text-[#212121]">
                    <input 
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={() => {
                        setInStockOnly(!inStockOnly);
                        setCurrentPage(1);
                      }}
                      className="rounded border-gray-300 text-[#212121] focus:ring-[#212121] h-3.5 w-3.5"
                    />
                    In Stock Only
                  </label>
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                className="flex items-center gap-1.5 hover:underline transition-all"
              >
                PRICE {(priceMin || priceMax) && '(Active)'} 
                <ChevronDown size={10} className={`transition-transform duration-200 ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'price' && (
                <div className="absolute left-0 mt-2.5 w-64 bg-white border border-[#E8E8E8] p-4 shadow-lg z-30 space-y-3">
                  <div className="flex gap-2">
                    <div>
                      <label className="block text-[9px] text-gray-400 mb-1 tracking-wider">MIN (INR)</label>
                      <input 
                        type="number"
                        placeholder="Min"
                        value={priceMinInput}
                        onChange={(e) => setPriceMinInput(e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#212121]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 mb-1 tracking-wider">MAX (INR)</label>
                      <input 
                        type="number"
                        placeholder="Max"
                        value={priceMaxInput}
                        onChange={(e) => setPriceMaxInput(e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#212121]"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setPriceMin(priceMinInput);
                      setPriceMax(priceMaxInput);
                      setCurrentPage(1);
                      setActiveDropdown(null);
                    }}
                    className="w-full bg-[#212121] text-white py-2 text-[9px] hover:bg-black transition-colors uppercase font-medium tracking-[0.2em] rounded"
                  >
                    Apply Price
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Side: Sort Options */}
          <div className="relative flex items-center gap-2 self-start md:self-auto">
            <span className="text-gray-400">SORT BY:</span>
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
              className="flex items-center gap-1.5 hover:underline transition-all font-semibold"
            >
              {sortBy === 'featured' && 'FEATURED'}
              {sortBy === 'newest' && 'NEW ARRIVALS'}
              {sortBy === 'price_asc' && 'PRICE: LOW TO HIGH'}
              {sortBy === 'price_desc' && 'PRICE: HIGH TO LOW'}
              <ChevronDown size={10} className={`transition-transform duration-200 ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'sort' && (
              <div className="absolute right-0 top-6 mt-2 w-56 bg-white border border-[#E8E8E8] py-2 shadow-lg z-30">
                {[
                  { value: 'featured', label: 'FEATURED' },
                  { value: 'newest', label: 'NEW ARRIVALS' },
                  { value: 'price_asc', label: 'PRICE: LOW TO HIGH' },
                  { value: 'price_desc', label: 'PRICE: HIGH TO LOW' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value as any);
                      setActiveDropdown(null);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F5F5F5] transition-colors text-[9px] tracking-widest ${
                      sortBy === opt.value ? 'font-bold text-[#212121]' : 'text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Active Filters tags */}
      {hasActiveFilters && (
        <div className="bg-neutral-50 border-b border-[#E8E8E8] py-3">
          <div className="mx-auto max-w-[1440px] px-8 flex flex-wrap items-center gap-2.5 text-[9px] text-[#212121] tracking-wider">
            <span className="text-gray-400 uppercase tracking-widest mr-1">ACTIVE FILTERS:</span>
            
            {/* Size tags */}
            {selectedSizes.map((size) => (
              <span key={size} className="inline-flex items-center gap-1.5 bg-white border border-[#E8E8E8] px-2.5 py-1 text-gray-700 font-medium">
                SIZE: {size}
                <button onClick={() => handleSizeToggle(size)} className="text-[#999] hover:text-[#212121] font-bold text-xs"><X size={8} /></button>
              </span>
            ))}

            {/* Color tags */}
            {selectedColors.map((color) => (
              <span key={color} className="inline-flex items-center gap-1.5 bg-white border border-[#E8E8E8] px-2.5 py-1 text-gray-700 font-medium capitalize">
                COLOR: {color}
                <button onClick={() => handleColorToggle(color)} className="text-[#999] hover:text-[#212121] font-bold text-xs"><X size={8} /></button>
              </span>
            ))}

            {/* Availability tag */}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8E8E8] px-2.5 py-1 text-gray-700 font-medium">
                AVAILABILITY: IN STOCK
                <button onClick={() => { setInStockOnly(false); setCurrentPage(1); }} className="text-[#999] hover:text-[#212121] font-bold text-xs"><X size={8} /></button>
              </span>
            )}

            {/* Price tag */}
            {(priceMin || priceMax) && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8E8E8] px-2.5 py-1 text-gray-700 font-medium">
                PRICE: INR {priceMin || '0'} - {priceMax || 'Max'}
                <button onClick={() => { setPriceMin(''); setPriceMinInput(''); setPriceMax(''); setPriceMaxInput(''); setCurrentPage(1); }} className="text-[#999] hover:text-[#212121] font-bold text-xs"><X size={8} /></button>
              </span>
            )}

            {/* Clear All Button */}
            <button 
              onClick={handleClearAll}
              className="text-[#212121] hover:underline uppercase font-bold tracking-widest ml-2"
            >
              CLEAR ALL
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex-grow bg-white py-16">
          <div className="mx-auto max-w-[1440px] px-8">
            <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse bg-[#F5F5F5] border border-gray-100" />
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex-grow bg-white py-24 text-center">
          <div className="mx-auto max-w-[1440px] px-8">
            <p className="text-[12px] text-[#999]">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-6 border border-[#212121] px-6 py-2 text-[11px] tracking-widest uppercase text-[#212121] hover:bg-[#212121] hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex-grow bg-white flex items-center justify-center py-32 text-center">
          <div className="mx-auto max-w-[1440px] px-8 w-full">
            {hasActiveFilters ? (
              <>
                <div className="mb-6 text-[40px] opacity-20">◻</div>
                <p className="text-[12px] tracking-widest uppercase text-[#999]">No Products Found</p>
                <p className="mt-2 text-[11px] text-[#BDBDBD]">Try modifying your active filters or clear search criteria.</p>
                <button 
                  onClick={handleClearAll}
                  className="mt-6 border border-[#212121] px-6 py-2 text-[10px] tracking-widest uppercase text-[#212121] hover:bg-[#212121] hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </>
            ) : (
              <div className="space-y-4 py-12">
                <h2 className="text-[32px] md:text-[56px] font-light tracking-[0.35em] uppercase text-[#212121] leading-none">
                  Coming Soon
                </h2>
                <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#999] font-light max-w-md mx-auto leading-relaxed">
                  We are currently preparing this selection. Please check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Products Grid Panel */
        <div className="flex-grow bg-white">
          <div className="mx-auto max-w-[1440px]">
            <ProductGrid
              products={products}
              columns={4}
              showViewAll={false}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-[#E8E8E8] bg-white py-12">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-[10px] tracking-widest uppercase text-[#212121] disabled:text-[#BDBDBD] disabled:cursor-not-allowed hover:underline transition-all"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-[10px] tracking-wide transition-all ${currentPage === page
                          ? 'bg-[#212121] text-white'
                          : 'text-[#212121] hover:bg-[#F5F5F5]'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-[10px] tracking-widest uppercase text-[#212121] disabled:text-[#BDBDBD] disabled:cursor-not-allowed hover:underline transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Philosophy Banner for /products route */}
      {!loading && !error && menuSlug === 'products' && !itemSlug && (
        <div className="w-full bg-[#111] text-white py-16 md:py-24 px-6 text-center font-['Poppins']">
          <div className="max-w-4xl mx-auto">
            <span className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#888] font-medium mb-8 block">
              FOUNDER'S PHILOSOPHY
            </span>
            <p className="text-[15px] md:text-[18px] font-light leading-relaxed text-[#eee] max-w-3xl mx-auto italic">
              &ldquo;This collection explores a quiet yet powerful identity inspired by Tokyo’s underground spaces. Clean structures, layered silhouettes, and controlled movement define each look. It’s not about loud expression, but about presence, attitude, and subtle strength. Every garment reflects a balance between minimalism and bold construction where silence becomes the statement and design speaks for itself.&rdquo;
            </p>
            <div className="mt-12 pt-8 border-t border-[#2a2a2a] max-w-xs mx-auto text-center text-[#888] text-[11px] md:text-[12px] font-light space-y-1 tracking-wide leading-relaxed">
              <p className="font-semibold text-white tracking-widest uppercase text-[10px] mb-2">Best Regards,</p>
              <p className="text-white">Team I AM TROUBLE</p>
              <p className="opacity-80">Evolve Clothing & Textiles</p>
              <p className="opacity-60">B 115-B, Basement, Kalkaji</p>
              <p className="opacity-60">Opposite South Park Apartments</p>
            </div>
          </div>
        </div>
      )}

      {/* Recently Viewed Panel (rendered on all successfully loaded pages) */}
      {!loading && !error && (
        <div className="bg-white pb-16">
          <RecentlyViewed />
        </div>
      )}
    </div>
  );
};

export default Collection;
