import React, { useEffect, useState } from 'react';
import { menuApi, productApi, orderApi } from '../../utils/api';
import { TrendingUp, Package, ShoppingCart, BarChart3 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    menuItems: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
    paidOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [menuRes, productsRes, ordersRes] = await Promise.all([
          menuApi.getAllMenuItems(),
          productApi.getAllProductsAdmin(),
          orderApi.getAllOrdersAdmin()
        ]);

        const products = productsRes.data || [];
        const orders = ordersRes.data || [];
        const menuItems = menuRes.data || [];

        const totalRevenue = orders
          .filter((o: any) => o.paymentStatus === 'Paid')
          .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        setStats({
          menuItems: menuItems.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          activeProducts: products.filter((p: any) => p.isActive).length,
          paidOrders: orders.filter((o: any) => o.paymentStatus === 'Paid').length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-gradient-to-br from-[#FF6B6B] to-[#FF5252]',
      subtext: `${stats.paidOrders} Paid`
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-gradient-to-br from-[#4ECDC4] to-[#44B8A8]',
      subtext: `${stats.activeProducts} Active`
    },
    {
      title: 'Menu Items',
      value: stats.menuItems,
      icon: BarChart3,
      color: 'bg-gradient-to-br from-[#FFD93D] to-[#FFC107]',
      subtext: 'Categories'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`,
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-[#6C5CE7] to-[#5F3DC4]',
      subtext: 'From Paid Orders'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E8E8E8] border-t-[#212121] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[13px] text-[#666]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-['Poppins']">
      {/* Header */}
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#212121] tracking-[-0.5px]">Dashboard</h1>
        <p className="text-[13px] text-[#666] mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg border border-[#E8E8E8] p-5 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg text-white`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-[12px] uppercase tracking-[0.1em] text-[#999] font-medium mb-1">
                {card.title}
              </p>
              <p className="text-[24px] font-bold text-[#212121] mb-1">
                {card.value}
              </p>
              <p className="text-[11px] text-[#666]">
                {card.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
          <h2 className="text-[16px] font-bold text-[#212121] mb-4">Quick Start Guide</h2>
          <div className="space-y-3">
            {[
              { icon: '✓', text: 'Google OAuth and Cloudinary configured' },
              { icon: '✓', text: 'Create menu items for navbar display' },
              { icon: '✓', text: 'Add columns with navigation links' },
              { icon: '✓', text: 'Upload images for mega menu' },
              { icon: '✓', text: 'Manage products with inventory' },
              { icon: '✓', text: 'Track orders and update statuses' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-[#4ECDC4] font-bold text-[14px] mt-0.5">{item.icon}</span>
                <p className="text-[13px] text-[#555]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
          <h2 className="text-[16px] font-bold text-[#212121] mb-4">Admin Features</h2>
          <div className="space-y-3">
            {[
              { title: 'Menu Manager', desc: 'Organize categories and navigation' },
              { title: 'Product Management', desc: 'Add, edit, and manage products' },
              { title: 'Order Tracking', desc: 'Monitor and update order status' },
              { title: 'Inventory Control', desc: 'Track stock and availability' },
              { title: 'Image Upload', desc: 'Cloudinary integration' },
              { title: 'User Dashboard', desc: 'View customer information' }
            ].map((feature, idx) => (
              <div key={idx} className="pb-3 border-b border-[#F0F0F0] last:border-0">
                <p className="text-[13px] font-semibold text-[#212121]">{feature.title}</p>
                <p className="text-[11px] text-[#999] mt-0.5">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
        <h2 className="text-[16px] font-bold text-[#212121] mb-4">Statistics Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF5252]/10 rounded-lg border border-[#FF6B6B]/20">
            <p className="text-[12px] text-[#FF6B6B] font-semibold">Total Orders</p>
            <p className="text-[20px] font-bold text-[#212121] mt-2">{stats.totalOrders}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#4ECDC4]/10 to-[#44B8A8]/10 rounded-lg border border-[#4ECDC4]/20">
            <p className="text-[12px] text-[#4ECDC4] font-semibold">Products</p>
            <p className="text-[20px] font-bold text-[#212121] mt-2">{stats.totalProducts}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#6C5CE7]/10 to-[#5F3DC4]/10 rounded-lg border border-[#6C5CE7]/20">
            <p className="text-[12px] text-[#6C5CE7] font-semibold">Revenue</p>
            <p className="text-[20px] font-bold text-[#212121] mt-2">₹{(stats.totalRevenue / 1000).toFixed(1)}K</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
