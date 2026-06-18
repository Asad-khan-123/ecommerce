import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '../context/ProductContext';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
  limit?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
  className?: string;
}

const ProductGrid = ({
  products,
  columns = 4,
  limit,
  showViewAll = false,
  viewAllLink = '/products',
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
      <div className={`grid gap-0 ${gridCols[columns]} bg-white`}>
        {displayProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

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
