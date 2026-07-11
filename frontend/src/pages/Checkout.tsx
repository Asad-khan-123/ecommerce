import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderApi, productApi } from '../utils/api';
import { ChevronRight, Lock } from 'lucide-react';

interface OrderItem {
  product: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}



// ── Field component ─────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string; id: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  type?: string; required?: boolean; error?: string;
  half?: boolean;
}> = ({ label, id, value, onChange, placeholder, type = 'text', required, error, half }) => (
  <div className={half ? 'flex-1 min-w-0' : 'w-full'}>
    <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.18em] text-[#999] mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border px-4 py-3 text-[12px] text-[#212121] placeholder-[#ccc] bg-white focus:outline-none transition-colors ${
        error ? 'border-red-400' : 'border-[#D8D8D8] focus:border-[#212121]'
      }`}
    />
    {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Main Checkout page ───────────────────────────────────────────────────────
const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine checkout mode
  const source = searchParams.get('source'); // 'cart' or null (buy-now)
  const buyNowProductId = searchParams.get('productId');
  const buyNowSize = searchParams.get('size') || '';
  const buyNowColor = searchParams.get('color') || '';
  const buyNowQty = parseInt(searchParams.get('qty') || '1');

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Shipping form state
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [user, navigate]);

  // Populate order items
  useEffect(() => {
    if (source === 'cart') {
      setOrderItems(cartItems.map(i => ({
        product: i._id,
        title: i.title,
        price: i.price,
        image: i.image,
        size: i.size,
        color: i.color,
        quantity: i.quantity
      })));
    } else if (buyNowProductId) {
      setLoadingProduct(true);
      productApi.getProductBySlug(buyNowProductId).then(res => {
        if (res?.data || res?.product) {
          const p = res.data || res.product;
          setOrderItems([{
            product: p._id,
            title: p.title,
            price: p.price,
            image: p.images?.[0] || '',
            size: buyNowSize,
            color: buyNowColor,
            quantity: buyNowQty
          }]);
        }
        setLoadingProduct(false);
      });
    }
  }, [source, buyNowProductId, cartItems]);

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = subtotal >= 2000 ? 0 : 150;
  const totalPrice = subtotal + shippingCost;

  const setField = (key: keyof typeof form) => (val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.phone.trim() || !/^[0-9]{10}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!form.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.postalCode.trim() || !/^[0-9]{6}$/.test(form.postalCode.trim())) newErrors.postalCode = 'Enter a valid 6-digit PIN code';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setSubmitting(false);
        return;
      }

      // Create Razorpay Order in Backend (Calculates price securely on database server)
      const res = await orderApi.createRazorpayOrder({
        items: orderItems,
        shippingAddress: form
      });

      if (!res.success) {
        alert(res.message || 'Failed to initialize payment order');
        setSubmitting(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || res.keyId || '',
        amount: res.amount,
        currency: res.currency,
        name: 'I AM TROUBLE BY KC',
        description: 'Order Payment',
        order_id: res.orderId,
        handler: async (paymentResponse: any) => {
          setSubmitting(true);
          try {
            // Verify payment signature securely on backend and create order record
            const verifyRes = await orderApi.verifyRazorpayPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              items: orderItems,
              shippingAddress: form,
              clearCart: source === 'cart'
            });

            if (verifyRes.success) {
              if (source === 'cart') clearCart();
              navigate(`/order-success/${verifyRes.data._id}`);
            } else {
              alert(verifyRes.message || 'Payment verification failed');
            }
          } catch (err) {
            console.error('Payment verification API error:', err);
            alert('An error occurred during payment verification.');
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: form.fullName,
          contact: form.phone,
          email: user?.email || '',
        },
        theme: {
          color: '#212121',
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Order checkout error:', err);
      alert('An error occurred while setting up payment.');
      setSubmitting(false);
    }
  };

  if (loadingProduct || submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center font-['Poppins']">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#212121]/20 border-t-[#212121] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[12px] uppercase tracking-widest text-[#999]">
            {submitting ? 'Placing your order...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (orderItems.length === 0 && !loadingProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-['Poppins'] px-6 text-center">
        <p className="text-[13px] uppercase tracking-[0.2em] text-[#999] mb-6">No items to checkout</p>
        <button onClick={() => navigate('/')} className="border border-[#212121] px-8 py-3 text-[11px] tracking-[0.2em] uppercase text-[#212121] hover:bg-[#212121] hover:text-white transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Poppins']">
      {/* Progress bar */}
      <div className="bg-white border-b border-[#E8E8E8] px-6 py-4">
        <div className="mx-auto max-w-[1100px] flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#999]">
          <span>Cart</span>
          <ChevronRight size={12} />
          <span className="text-[#212121] font-semibold">Shipping Details</span>
          <ChevronRight size={12} />
          <span>Payment</span>
          <ChevronRight size={12} />
          <span>Confirmation</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-10 lg:py-14 grid lg:grid-cols-[1fr_420px] gap-12">
        {/* ── Left: Shipping Form ── */}
        <div>
          <h1 className="text-[18px] font-light tracking-tight text-[#212121] mb-8">Shipping Details</h1>

          <div className="space-y-5">
            <Field label="Full Name" id="fullName" value={form.fullName} onChange={setField('fullName')} placeholder="John Doe" required error={errors.fullName} />

            <Field label="Phone Number" id="phone" value={form.phone} onChange={setField('phone')} placeholder="10-digit mobile number" type="tel" required error={errors.phone} />

            <Field label="Address Line 1" id="addressLine1" value={form.addressLine1} onChange={setField('addressLine1')} placeholder="House No., Building, Street" required error={errors.addressLine1} />

            <Field label="Address Line 2 (Optional)" id="addressLine2" value={form.addressLine2} onChange={setField('addressLine2')} placeholder="Apartment, Locality, Landmark" />

            <div className="flex gap-4">
              <Field label="City" id="city" value={form.city} onChange={setField('city')} placeholder="Mumbai" required error={errors.city} half />
              <Field label="State" id="state" value={form.state} onChange={setField('state')} placeholder="Maharashtra" required error={errors.state} half />
            </div>

            <div className="flex gap-4">
              <Field label="PIN Code" id="postalCode" value={form.postalCode} onChange={setField('postalCode')} placeholder="400001" required error={errors.postalCode} half />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#999] mb-1.5">Country</label>
                <div className="w-full border border-[#D8D8D8] bg-[#F9F9F9] px-4 py-3 text-[12px] text-[#999] cursor-not-allowed">India</div>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="mt-8 w-full bg-[#212121] text-white py-4 text-[11px] font-medium tracking-[0.25em] uppercase hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <Lock size={13} />
            Continue to Payment
          </button>
          <p className="mt-3 text-center text-[10px] text-[#999] tracking-wide">
            Your personal data is secured with 256-bit encryption.
          </p>
        </div>

        {/* ── Right: Order Summary ── */}
        <div>
          <div className="bg-white border border-[#E8E8E8] p-6 sticky top-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#212121] mb-5 pb-4 border-b border-[#F0F0F0]">
              Order Summary ({orderItems.reduce((s, i) => s + i.quantity, 0)} items)
            </h2>

            <div className="space-y-4 mb-5">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-16 h-20 bg-[#F5F5F5] flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[9px] text-[#ccc] uppercase tracking-wider">No img</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-medium text-[#212121] uppercase tracking-wide line-clamp-2">{item.title}</p>
                    <p className="text-[10px] text-[#999] mt-1">Size: {item.size} / Color: {item.color}</p>
                    <p className="text-[10px] text-[#999]">Qty: {item.quantity}</p>
                    <p className="text-[12px] font-semibold text-[#212121] mt-1.5">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#F0F0F0] pt-4 space-y-2.5">
              <div className="flex justify-between text-[11px] text-[#666]">
                <span className="tracking-wide">Subtotal</span>
                <span>₹ {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#666]">
                <span className="tracking-wide">Shipping</span>
                <span>{shippingCost === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹ ${shippingCost}`}</span>
              </div>
              {shippingCost > 0 && (
                <p className="text-[10px] text-[#aaa] italic">Free shipping on orders over ₹2,000</p>
              )}
              <div className="flex justify-between text-[13px] font-semibold text-[#212121] pt-2 border-t border-[#E8E8E8]">
                <span className="uppercase tracking-widest text-[11px]">Total</span>
                <span>₹ {totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 bg-[#F9F9F9] p-3 rounded-sm">
              <Lock size={12} className="text-[#999] flex-shrink-0" />
              <p className="text-[10px] text-[#999] leading-relaxed">Secure checkout powered by Razorpay. Your payment info is never stored.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
