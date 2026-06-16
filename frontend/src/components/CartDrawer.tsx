import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
  } = useCart();

  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  const handleCheckoutClick = () => {
    setCheckoutStatus('Processing...');
    setTimeout(() => {
      setCheckoutStatus('Checkout functionality is coming soon!');
      setTimeout(() => setCheckoutStatus(null), 4000);
    }, 1200);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-300 ${
        isCartOpen ? 'visible' : 'invisible'
      }`}
    >
      {/* Backdrop Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[440px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out font-['Poppins'] text-[#212121] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E8E8] px-6 py-5">
          <h2 className="text-[13px] font-medium tracking-[0.2em] uppercase">
            Shopping Bag {cartItems.length > 0 && `(${cartItems.reduce((acc, item) => acc + item.quantity, 0)})`}
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="p-1 -mr-1 transition-opacity hover:opacity-60"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#999] font-light">
                Your bag is empty
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-6 border border-[#212121] px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase text-[#212121] transition-colors hover:bg-[#212121] hover:text-white"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item._id}-${item.size}-${item.color}`}
                className="flex items-stretch border-b border-[#F5F5F5] pb-5"
              >
                {/* Product image */}
                <Link
                  to={`/products/${item.slug}`}
                  onClick={() => setCartOpen(false)}
                  className="w-[75px] aspect-[3/4] bg-[#F5F5F5] overflow-hidden flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Product details */}
                <div className="flex-1 ml-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-x-2">
                      <Link
                        to={`/products/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="text-[12px] font-medium uppercase tracking-wider hover:underline text-[#212121] line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item._id, item.size, item.color)}
                        aria-label="Remove item"
                        className="text-[10px] uppercase tracking-widest text-[#999] hover:text-[#212121] transition-colors self-start pt-[1px]"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="text-[10px] text-[#999] uppercase tracking-wider mt-1.5 font-light">
                      Size: {item.size} &nbsp;/&nbsp; Color: {item.color}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E8E8E8] h-7 w-20 justify-between px-1 bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.size, item.color, item.quantity - 1)
                        }
                        className="w-5 h-full flex items-center justify-center text-[#212121] hover:opacity-60 transition-opacity"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={10} strokeWidth={2} />
                      </button>
                      <span className="text-[11px] text-[#212121] font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.size, item.color, item.quantity + 1)
                        }
                        className="w-5 h-full flex items-center justify-center text-[#212121] hover:opacity-60 transition-opacity"
                        aria-label="Increase quantity"
                      >
                        <Plus size={10} strokeWidth={2} />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-[12px] font-semibold text-[#212121]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#E8E8E8] p-6 space-y-4 bg-white z-10">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-[12px] uppercase tracking-[0.2em] font-semibold">
              <span>Subtotal</span>
              <span>Rs. {cartSubtotal.toLocaleString()}</span>
            </div>

            {/* Note */}
            <p className="text-[9px] text-[#999] uppercase tracking-wider text-center font-light leading-relaxed">
              Shipping & taxes calculated at checkout.
            </p>

            {/* Checkout status / error message */}
            {checkoutStatus && (
              <div className="text-[11px] text-center font-light tracking-wide py-1 text-amber-700 bg-amber-50 border border-amber-200/50 rounded-sm">
                {checkoutStatus}
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              disabled={checkoutStatus === 'Processing...'}
              className="w-full bg-[#212121] text-white py-3.5 text-[11px] font-medium tracking-[0.25em] uppercase hover:bg-black transition-colors duration-200 text-center block disabled:opacity-75"
            >
              {checkoutStatus === 'Processing...' ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
