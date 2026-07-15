import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../context/ProductContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];
  const displayImage = hovered && secondaryImage ? secondaryImage : primaryImage;

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
  ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product.slug}`);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block font-['Poppins']"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#F5F5F5] aspect-[9/17]">
        {displayImage && !imgError ? (
          <img
            src={displayImage}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#EBEBEB]">
            <span className="text-[11px] tracking-widest text-[#999]">NO IMAGE</span>
          </div>
        )}

        {/* Discount Badge */}
        {discount && (
          <span className="absolute left-3 top-3 bg-[#212121] px-2 py-[2px] text-[9px] tracking-widest text-white uppercase">
            -{discount}%
          </span>
        )}

        {/* Tag Badge */}
        {product.tag && (
          <span className="absolute right-3 top-3 bg-white border border-[#212121]/15 px-2 py-[2px] text-[10px] tracking-widest text-[#212121] uppercase font-medium">
            {product.tag}
          </span>
        )}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="bg-white px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-[#212121]">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick Add Button - Bottom Right + Small */}
        {hovered && product.inStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 bg-white px-3 py-1.5 text-[9px] text-[#212121] tracking-[0.1em] uppercase hover:bg-[#212121] hover:text-white transition-all duration-200"
          >
            QUICK ADD
          </button>
        )}
      </div>

      {/* Product Info - Exact 431-88 Style */}
      <div className="px-4 py-2.5">
        <h3 className="text-[12px] font-normal text-[#212121] line-clamp-2 leading-normal">
          {product.title}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[12px] text-[#212121]">
            INR {product.price.toLocaleString('en-IN')}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[11px] text-[#999] line-through">
              INR {product.compareAtPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
