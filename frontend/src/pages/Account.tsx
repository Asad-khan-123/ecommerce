import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../utils/api';
import { ShoppingBag, LogOut, Clock, Calendar, ShieldCheck, HelpCircle } from 'lucide-react';

interface OrderItem {
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface OrderData {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

export const Account: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Authenticate user
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?redirect=/account');
    }
  }, [user, isLoading, navigate]);

  // Fetch orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        if (res.success) {
          setOrders(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching my orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-['Poppins']">
        <div className="w-8 h-8 border-2 border-[#212121]/20 border-t-[#212121] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Poppins'] py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E8E8E8] pb-8 mb-10 gap-6">
          <div>
            <h1 className="text-[26px] font-light tracking-tight text-[#212121]">My Account</h1>
            <p className="text-[12px] text-[#999] mt-1">Manage orders, view tracking details, and configure account settings</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-[#212121] text-[#212121] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-[#212121] hover:text-white transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E8E8E8] p-6 sticky top-24">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#212121] mb-6 pb-2 border-b border-[#FAFAFA]">
                Profile Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-[#bbb] block font-semibold mb-1">Full Name</label>
                  <p className="text-[13px] text-[#212121] font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-[#bbb] block font-semibold mb-1">Email Address</label>
                  <p className="text-[13px] text-[#212121] font-medium break-all">{user.email}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-[#bbb] block font-semibold mb-1">Member Role</label>
                  <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-[10px] uppercase font-bold px-2 py-0.5 mt-1 rounded tracking-wide">
                    <ShieldCheck size={12} /> {user.role}
                  </span>
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="mt-8 pt-6 border-t border-[#F0F0F0]">
                  <Link
                    to="/admin"
                    className="block text-center bg-[#212121] text-white py-3 text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-black transition-colors"
                  >
                    Go to Admin Panel
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Orders History List */}
          <div className="lg:col-span-2">
            <h2 className="text-[14px] font-medium tracking-tight text-[#212121] mb-6 flex items-center gap-2">
              <ShoppingBag size={18} /> Order History ({orders.length})
            </h2>

            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-[#E8E8E8]">
                <div className="w-6 h-6 border-2 border-[#212121]/20 border-t-[#212121] rounded-full animate-spin" />
                <span className="text-[11px] text-[#999] uppercase tracking-widest">Loading order files...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-[#E8E8E8] text-center py-20 px-6">
                <ShoppingBag size={42} className="mx-auto text-[#CCC] mb-4" />
                <h3 className="text-[14px] font-light text-[#212121] mb-2">No orders found</h3>
                <p className="text-[12px] text-[#999] mb-6 max-w-sm mx-auto">You haven't placed any orders yet. Visit our shop to browse our collections.</p>
                <Link
                  to="/"
                  className="inline-block border border-[#212121] text-[#212121] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-[#212121] hover:text-white transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-[#E8E8E8] overflow-hidden hover:shadow-md transition-shadow">
                    {/* Order Meta Header */}
                    <div className="bg-[#FAFAFA] border-b border-[#E8E8E8] px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-[12px] text-[#666]">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-[#999] mb-0.5">Order Placed</p>
                          <p className="font-medium text-[#212121] flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#999]" />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-[#999] mb-0.5">Total Amount</p>
                          <p className="font-semibold text-[#212121]">₹ {order.totalPrice?.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-wider text-[#999] mb-0.5">Order ID</p>
                        <p className="font-mono text-[#212121] font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Order Details & Badges */}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-[#F5F5F5]">
                        {/* Status Badges */}
                        <div className="flex gap-2">
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : order.paymentStatus === 'Failed'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            Payment: {order.paymentStatus}
                          </span>
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : order.orderStatus === 'Out for Delivery'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            Delivery: {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="space-y-4 mb-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <div className="w-12 h-16 bg-[#F5F5F5] flex-shrink-0 overflow-hidden border border-[#E8E8E8] rounded">
                              {item.image ? (
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px] text-[#CCC]">No img</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium text-[#212121] uppercase tracking-wide truncate">{item.title}</p>
                              <p className="text-[10px] text-[#999] mt-0.5">Size: {item.size} / Color: {item.color} / Qty: {item.quantity}</p>
                            </div>
                            <p className="text-[12px] font-semibold text-[#212121] flex-shrink-0">
                              ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="flex justify-end pt-2">
                        <Link
                          to={`/order-success/${order._id}`}
                          className="flex items-center gap-1.5 bg-[#212121] text-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-black transition-colors"
                        >
                          <Clock size={12} />
                          Track Order / Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Assistance Card */}
            <div className="mt-8 p-6 bg-neutral-100 border border-[#E8E8E8] flex items-center gap-4 text-[12px] text-[#666]">
              <HelpCircle className="text-[#999] flex-shrink-0" size={20} />
              <p>
                Need help with your orders or delivery status? Please contact our Support Team at{' '}
                <span className="font-semibold text-[#212121]">support@iamtrouble.com</span> or call our customer service hotline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
