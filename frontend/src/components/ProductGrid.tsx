import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images?: string[];
  tag?: string;
}

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
  limit?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
  onQuickAdd?: (productId: string) => void;
  className?: string;
}

const ProductGrid = ({
  products,
  columns = 4,
  limit,
  showViewAll = false,
  viewAllLink = '/products',
  onQuickAdd,
  className = ''
}: ProductGridProps) => {
  const displayProducts = limit ? products.slice(0, limit) : products;

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5'
  };

  return (
    <div className={className}>
      {/* Product Grid - Zero Gap 431-88 Style */}
      <div className={`grid gap-0 ${gridCols[columns]}`}>
        {displayProducts.map((product) => (
          <div key={product._id} className="group relative aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
            <Link to={`/products/${product.slug}`}>
              <img
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

            {/* Product Info - Bottom Left */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <h3 className="text-[12px] font-light tracking-wide drop-shadow-lg">{product.title}</h3>
              <p className="mt-1 text-[12px] font-light drop-shadow-lg">
                ₹{product.price?.toLocaleString('en-IN')}
              </p>
            </div>

            {/* QUICK ADD Button */}
            {onQuickAdd && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickAdd(product._id);
                }}
                className="absolute bottom-6 left-6 bg-white px-6 py-2.5 text-[10px] font-medium tracking-[0.2em] text-[#212121] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-[#212121] hover:text-white"
              >
                QUICK ADD
              </button>
            )}

            {/* Tag - Right Bottom */}
            {product.tag && (
              <span className="absolute bottom-6 right-6 bg-white px-4 py-1.5 text-[10px] font-medium tracking-[0.15em] text-[#212121]">
                {product.tag}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* VIEW ALL Button */}
      {showViewAll && (
        <div className="flex justify-center py-16 bg-white">
          <Link
            to={viewAllLink}
            className="bg-[#2D2D2D] px-12 py-3.5 text-[11px] text-white tracking-[0.2em] uppercase hover:bg-black transition-colors"
          >
            VIEW ALL
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
