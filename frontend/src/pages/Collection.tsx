import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images?: string[];
  tag?: string;
}

const PRODUCTS_PER_PAGE = 12;

const Collection = () => {
  const { menuSlug, itemSlug } = useParams<{ menuSlug: string; itemSlug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [menuSlug, itemSlug, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const url = itemSlug
        ? `${API_BASE_URL}/collections/${menuSlug}/${itemSlug}?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`
        : `${API_BASE_URL}/collections/${menuSlug}?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-['Poppins']">
        <div className="mx-auto max-w-[1440px] px-8 py-16">
          <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-[#F5F5F5]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white font-['Poppins']">
        <div className="mx-auto max-w-[1440px] px-8 py-24 text-center">
          <p className="text-[12px] text-[#999]">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-6 border border-[#212121] px-6 py-2 text-[11px] tracking-widest uppercase text-[#212121] hover:bg-[#212121] hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
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

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="mx-auto max-w-[1440px] px-8 py-24 text-center">
          <div className="mb-6 text-[40px] opacity-20">◻</div>
          <p className="text-[12px] tracking-widest uppercase text-[#999]">No Products Found</p>
          <p className="mt-2 text-[11px] text-[#BDBDBD]">Check back soon for new arrivals.</p>
        </div>
      ) : (
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
                className="px-4 py-2 text-[11px] tracking-widest uppercase text-[#212121] disabled:text-[#BDBDBD] disabled:cursor-not-allowed hover:underline transition-all"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-[11px] tracking-wide transition-all ${currentPage === page
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
                className="px-4 py-2 text-[11px] tracking-widest uppercase text-[#212121] disabled:text-[#BDBDBD] disabled:cursor-not-allowed hover:underline transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Collection;
