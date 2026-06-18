import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Menu Manager', href: '/admin/menu', icon: '🎯' },
    { label: 'Banners', href: '/admin/banners', icon: '🖼️' },
    { label: 'Products', href: '/admin/products', icon: '🛍️' },
    { label: 'Orders', href: '/admin/orders', icon: '📦' }
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-['Poppins']">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-50 w-64 bg-[#212121] text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto overflow-y-auto`}
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div>
            <h1 className="text-[16px] font-bold tracking-[0.05em]">431-88</h1>
            <p className="text-[11px] text-[#999] tracking-[0.1em] mt-1">ADMIN PANEL</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-4 py-3 transition-all text-[13px] font-medium border-l-2 ${
                    active
                      ? 'bg-white/10 text-white border-white'
                      : 'text-[#BDBDBD] border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-[16px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#333] bg-[#1a1a1a]">
          <div className="mb-4 pb-4 border-b border-[#333]">
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#777] mb-2">Logged in as</p>
            <p className="text-[13px] font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-[#999] truncate">{user?.email || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-transparent border border-white/20 hover:bg-white hover:text-zinc-900 hover:border-white text-white rounded-lg transition-all text-[12px] font-medium tracking-[0.05em]"
          >
            <LogOut size={16} className="mr-2" />
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="bg-white border-b border-[#E8E8E8] px-4 sm:px-6 py-4 flex items-center justify-between lg:hidden">
          <h1 className="text-[16px] font-semibold text-[#212121]">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
          >
            {sidebarOpen ? <X size={24} className="text-[#212121]" /> : <Menu size={24} className="text-[#212121]" />}
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-[#F5F5F5] p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
