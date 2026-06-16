import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../utils/api';
import { CheckCircle, Package, Truck, Home, Clock } from 'lucide-react';

interface OrderData {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentId: string;
  totalPrice: number;
  subtotal: number;
  shippingCost: number;
  createdAt: string;
  items: {
    title: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const STEPS = [
  { label: 'Order Placed', icon: CheckCircle, status: 'Processing' },
  { label: 'Shipped', icon: Package, status: 'Shipped' },
  { label: 'Out for Delivery', icon: Truck, status: 'Out for Delivery' },
  { label: 'Delivered', icon: Home, status: 'Delivered' },
];

const statusOrder = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    orderApi.getOrderById(id).then(res => {
      if (res.success) setOrder(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-['Poppins']">
        <div className="w-8 h-8 border-2 border-[#212121]/20 border-t-[#212121] rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-['Poppins'] text-center px-6">
        <p className="text-[13px] uppercase tracking-[0.2em] text-[#999] mb-6">Order not found</p>
        <Link to="/" className="border border-[#212121] px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-[#212121] hover:text-white transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusOrder.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Poppins']">
      <div className="mx-auto max-w-[860px] px-6 py-12 lg:py-16">

        {/* ── Success Header ── */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-[22px] font-light tracking-tight text-[#212121] mb-2">
            Order Confirmed
          </h1>
          <p className="text-[12px] text-[#999] tracking-wide">
            Thank you, <span className="text-[#212121] font-medium">{order.shippingAddress.fullName}</span>! Your order has been placed successfully.
          </p>
          <p className="text-[11px] text-[#bbb] mt-1.5 tracking-widest uppercase">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          {order.paymentId && (
            <p className="text-[10px] text-[#bbb] mt-1">
              Payment ID: <span className="font-mono">{order.paymentId}</span>
            </p>
          )}
        </div>

        {/* ── Delivery Progress Tracker ── */}
        {order.orderStatus !== 'Cancelled' && (
          <div className="bg-white border border-[#E8E8E8] p-6 lg:p-8 mb-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#212121] mb-8">Delivery Status</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-[1px] bg-[#E8E8E8] mx-8" />
              <div
                className="absolute top-5 left-0 h-[1px] bg-[#212121] transition-all duration-700 mx-8"
                style={{ width: `${Math.min(currentStepIndex / (STEPS.length - 1), 1) * 100}%` }}
              />

              <div className="relative grid grid-cols-4 gap-2">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 bg-white ${
                        isCompleted
                          ? 'border-[#212121] bg-[#212121]'
                          : 'border-[#E8E8E8]'
                      } ${isCurrent ? 'ring-4 ring-[#212121]/10' : ''}`}>
                        <Icon size={18} className={isCompleted ? 'text-white' : 'text-[#ccc]'} />
                      </div>
                      <p className={`mt-3 text-[10px] text-center leading-tight tracking-wider uppercase ${
                        isCompleted ? 'text-[#212121] font-semibold' : 'text-[#ccc]'
                      }`}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            {order.orderStatus === 'Processing' && (
              <p className="mt-8 text-center text-[11px] text-[#999] flex items-center justify-center gap-1.5">
                <Clock size={12} /> Estimated delivery in 5–7 business days
              </p>
            )}
          </div>
        )}

        {order.orderStatus === 'Cancelled' && (
          <div className="bg-red-50 border border-red-200 p-5 mb-6 text-center">
            <p className="text-[12px] font-semibold text-red-600 tracking-wide">Order Cancelled</p>
            <p className="text-[11px] text-red-400 mt-1">If you were charged, your refund will be processed in 5–7 business days.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* ── Shipping Address ── */}
          <div className="bg-white border border-[#E8E8E8] p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#212121] mb-4">Shipping To</h2>
            <div className="space-y-1 text-[12px] text-[#555] leading-relaxed">
              <p className="font-medium text-[#212121]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* ── Payment Summary ── */}
          <div className="bg-white border border-[#E8E8E8] p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#212121] mb-4">Payment</h2>
            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between text-[#666]">
                <span>Subtotal</span>
                <span>₹ {order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#666]">
                <span>Shipping</span>
                <span>{(order.shippingCost || 0) === 0 ? 'Free' : `₹ ${order.shippingCost}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#212121] pt-2 border-t border-[#F0F0F0] text-[13px]">
                <span>Total Paid</span>
                <span>₹ {order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] mt-2">
                <span className="text-[#999]">Payment Status</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : order.paymentStatus === 'Failed'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-700'
                }`}>{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-white border border-[#E8E8E8] p-6 mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#212121] mb-5 pb-4 border-b border-[#F0F0F0]">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b border-[#F9F9F9] last:border-0 last:pb-0">
                <div className="w-16 h-20 bg-[#F5F5F5] flex-shrink-0 overflow-hidden">
                  {item.image
                    ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><span className="text-[9px] text-[#ccc]">No img</span></div>
                  }
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-[#212121] uppercase tracking-wide">{item.title}</p>
                  <p className="text-[10px] text-[#999] mt-1">Size: {item.size} / Color: {item.color} / Qty: {item.quantity}</p>
                  <p className="text-[12px] font-semibold text-[#212121] mt-2">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="border border-[#212121] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase text-[#212121] text-center hover:bg-[#212121] hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
