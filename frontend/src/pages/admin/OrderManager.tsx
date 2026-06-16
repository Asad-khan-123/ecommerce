import React, { useEffect, useState, useCallback } from 'react';
import { orderApi } from '../../utils/api';
import { X, ChevronDown, Package, RefreshCw } from 'lucide-react';

interface OrderItem {
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface Order {
  _id: string;
  user: { name: string; email: string; avatar?: string };
  items: OrderItem[];
  shippingAddress: {
    fullName: string; phone: string; addressLine1: string;
    addressLine2: string; city: string; state: string; postalCode: string; country: string;
  };
  paymentStatus: string;
  paymentId: string;
  orderStatus: string;
  totalPrice: number;
  subtotal: number;
  shippingCost: number;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Processing:       'bg-blue-100 text-blue-700',
  Shipped:          'bg-purple-100 text-purple-700',
  'Out for Delivery': 'bg-amber-100 text-amber-700',
  Delivered:        'bg-green-100 text-green-700',
  Cancelled:        'bg-red-100 text-red-600',
};

const PAYMENT_COLORS: Record<string, string> = {
  Paid:    'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Failed:  'bg-red-100 text-red-600',
};

const ORDER_STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed'];

// ── Status badge ─────────────────────────────────────────────────────────────
const Badge: React.FC<{ label: string; colorClass: string }> = ({ label, colorClass }) => (
  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${colorClass}`}>
    {label}
  </span>
);

// ── Order Detail Modal ────────────────────────────────────────────────────────
const OrderDetailModal: React.FC<{
  order: Order;
  onClose: () => void;
  onOrderStatusChange: (id: string, status: string) => void;
  onPaymentStatusChange: (id: string, status: string) => void;
}> = ({ order, onClose, onOrderStatusChange, onPaymentStatusChange }) => {
  const [savingOrder, setSavingOrder] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [localOrderStatus, setLocalOrderStatus] = useState(order.orderStatus);
  const [localPaymentStatus, setLocalPaymentStatus] = useState(order.paymentStatus);

  const saveOrderStatus = async () => {
    setSavingOrder(true);
    await onOrderStatusChange(order._id, localOrderStatus);
    setSavingOrder(false);
  };

  const savePaymentStatus = async () => {
    setSavingPayment(true);
    await onPaymentStatusChange(order._id, localPaymentStatus);
    setSavingPayment(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-8">
      <div className="relative bg-white w-full max-w-[700px] rounded-lg shadow-2xl font-['Poppins'] mb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E8E8]">
          <div>
            <h2 className="text-[14px] font-semibold text-[#212121]">
              Order #{order._id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-[11px] text-[#999] mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#F5F5F5] rounded-full transition-colors">
            <X size={18} className="text-[#666]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F9F9F9] rounded-lg p-4">
              <p className="text-[10px] uppercase tracking-widest text-[#999] mb-2">Customer</p>
              <p className="text-[13px] font-semibold text-[#212121]">{order.user?.name || '—'}</p>
              <p className="text-[11px] text-[#666]">{order.user?.email || '—'}</p>
            </div>
            <div className="bg-[#F9F9F9] rounded-lg p-4">
              <p className="text-[10px] uppercase tracking-widest text-[#999] mb-2">Payment</p>
              <Badge label={order.paymentStatus} colorClass={PAYMENT_COLORS[order.paymentStatus] || 'bg-gray-100 text-gray-600'} />
              {order.paymentId && (
                <p className="text-[10px] text-[#999] mt-2 font-mono truncate">{order.paymentId}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#999] mb-3">Shipping Address</p>
            <div className="border border-[#E8E8E8] rounded-lg p-4 text-[12px] text-[#555] space-y-0.5">
              <p className="font-semibold text-[#212121]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#999] mb-3">Items ({order.items.length})</p>
            <div className="border border-[#E8E8E8] rounded-lg divide-y divide-[#F5F5F5]">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3">
                  <div className="w-12 h-14 bg-[#F5F5F5] flex-shrink-0 overflow-hidden rounded">
                    {item.image
                      ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      : <Package size={16} className="text-[#ccc] m-auto mt-3" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#212121] truncate">{item.title}</p>
                    <p className="text-[10px] text-[#999]">Size: {item.size} / Color: {item.color} / Qty: {item.quantity}</p>
                  </div>
                  <p className="text-[12px] font-semibold text-[#212121] flex-shrink-0">
                    ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#F9F9F9] rounded-lg p-4 space-y-2 text-[12px]">
            <div className="flex justify-between text-[#666]"><span>Subtotal</span><span>₹ {order.subtotal?.toLocaleString('en-IN') || order.totalPrice.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-[#666]"><span>Shipping</span><span>{(order.shippingCost || 0) === 0 ? 'Free' : `₹ ${order.shippingCost}`}</span></div>
            <div className="flex justify-between font-bold text-[#212121] pt-2 border-t border-[#E8E8E8]"><span>Total</span><span>₹ {order.totalPrice.toLocaleString('en-IN')}</span></div>
          </div>

          {/* Status Controls */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F0F0F0]">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#999] mb-2">Order Status</p>
              <div className="relative">
                <select
                  value={localOrderStatus}
                  onChange={e => setLocalOrderStatus(e.target.value)}
                  className="w-full appearance-none border border-[#D8D8D8] bg-white px-3 py-2.5 text-[12px] text-[#212121] focus:border-[#212121] focus:outline-none pr-8"
                >
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999]" />
              </div>
              <button
                onClick={saveOrderStatus}
                disabled={savingOrder || localOrderStatus === order.orderStatus}
                className="mt-2 w-full bg-[#212121] text-white py-2 text-[11px] font-medium tracking-[0.1em] uppercase hover:bg-black transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                {savingOrder ? <><span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />Saving...</> : 'Update Status'}
              </button>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#999] mb-2">Payment Status</p>
              <div className="relative">
                <select
                  value={localPaymentStatus}
                  onChange={e => setLocalPaymentStatus(e.target.value)}
                  className="w-full appearance-none border border-[#D8D8D8] bg-white px-3 py-2.5 text-[12px] text-[#212121] focus:border-[#212121] focus:outline-none pr-8"
                >
                  {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999]" />
              </div>
              <button
                onClick={savePaymentStatus}
                disabled={savingPayment || localPaymentStatus === order.paymentStatus}
                className="mt-2 w-full border border-[#212121] text-[#212121] py-2 text-[11px] font-medium tracking-[0.1em] uppercase hover:bg-[#212121] hover:text-white transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                {savingPayment ? <><span className="w-3 h-3 border border-[#212121]/40 border-t-[#212121] rounded-full animate-spin" />Saving...</> : 'Update Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main OrderManager ─────────────────────────────────────────────────────────
export const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await orderApi.getAllOrdersAdmin();
    if (res.success) setOrders(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleOrderStatusChange = async (id: string, status: string) => {
    const res = await orderApi.updateOrderStatus(id, status);
    if (res.success) {
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
      if (selectedOrder?._id === id) setSelectedOrder(prev => prev ? { ...prev, orderStatus: status } : null);
    }
  };

  const handlePaymentStatusChange = async (id: string, status: string) => {
    const res = await orderApi.updatePaymentStatus(id, status);
    if (res.success) {
      setOrders(prev => prev.map(o => o._id === id ? { ...o, paymentStatus: status } : o));
      if (selectedOrder?._id === id) setSelectedOrder(prev => prev ? { ...prev, paymentStatus: status } : null);
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter);

  // Stats
  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.paymentStatus === 'Paid').length,
    processing: orders.filter(o => o.orderStatus === 'Processing').length,
    revenue: orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.totalPrice, 0)
  };

  return (
    <div className="font-['Poppins']">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#212121]">Orders</h1>
          <p className="text-[12px] text-[#999] mt-0.5">{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 border border-[#D8D8D8] px-4 py-2 text-[11px] tracking-wider uppercase text-[#666] hover:border-[#212121] hover:text-[#212121] transition-colors">
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: stats.total, color: 'text-[#212121]' },
          { label: 'Paid Orders', value: stats.paid, color: 'text-green-600' },
          { label: 'Processing', value: stats.processing, color: 'text-blue-600' },
          { label: 'Revenue', value: `₹ ${stats.revenue.toLocaleString('en-IN')}`, color: 'text-[#212121]' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-[#E8E8E8] rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#999] mb-1">{stat.label}</p>
            <p className={`text-[20px] font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['All', ...ORDER_STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-[11px] tracking-wider uppercase border transition-colors rounded-full ${
              filter === s
                ? 'bg-[#212121] text-white border-[#212121]'
                : 'border-[#D8D8D8] text-[#666] hover:border-[#212121] hover:text-[#212121]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#212121]/20 border-t-[#212121] rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#E8E8E8] rounded-lg flex flex-col items-center justify-center py-16 text-center">
          <Package size={40} className="text-[#D8D8D8] mb-4" />
          <p className="text-[12px] uppercase tracking-widest text-[#999]">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E8E8E8] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F0F0F0] bg-[#FAFAFA]">
                  {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-[#999] font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} className="border-b border-[#F9F9F9] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-mono text-[#212121] font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-medium text-[#212121]">{order.user?.name || '—'}</p>
                      <p className="text-[10px] text-[#999]">{order.user?.email || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-[#666] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-[#666]">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-[#212121] whitespace-nowrap">
                      ₹ {order.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={order.paymentStatus} colorClass={PAYMENT_COLORS[order.paymentStatus] || 'bg-gray-100 text-gray-600'} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={order.orderStatus} colorClass={STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[11px] uppercase tracking-wider text-[#2D81F7] hover:underline font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderStatusChange={handleOrderStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
        />
      )}
    </div>
  );
};

export default OrderManager;
