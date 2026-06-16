import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuApi } from '../utils/api';
import { User, Search, ShoppingBag, Menu, X } from 'lucide-react';

interface MenuItemData {
  _id: string;
  title: string;
  slug: string;
  columns: Column[];
  images: Image[];
}

interface Column {
  _id: string;
  heading: string;
  items: ColumnItem[];
}

interface ColumnItem {
  label: string;
  link: string;
}

interface Image {
  imageUrl: string;
  imageTitle: string;
}

const Navbar = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await menuApi.getMenuItems();
        if (response.success) {
          console.log('Menu items received:', response.data);
          response.data?.forEach((item: MenuItemData) => {
            console.log(`Menu "${item.title}" images:`, item.images);
          });
          setMenuItems(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <header className="sticky top-0 z-40 h-[60px] bg-white font-['Poppins']">
        <div className="mx-auto flex h-full max-w-[1440px] items-center px-8">
          <span className="text-[12px] text-[#212121]">Loading...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white font-['Poppins']">
      <div className="mx-auto w-full max-w-[1440px] px-8">
        <div className="flex h-[60px] items-center justify-between">

          {/* Left: Desktop Nav Links with Mega Menu */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-x-8">
              {menuItems.map((menuItem) => (
                <li
                  key={menuItem._id}
                  className="group relative flex h-[60px] items-center"
                  onMouseEnter={() => setActiveMenu(menuItem.slug)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    to={`/${menuItem.slug}`}
                    className="text-[12px] text-[#212121] hover:underline hover:underline-offset-[6px] hover:decoration-[#212121]"
                  >
                    {menuItem.title}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {activeMenu === menuItem.slug && (
                    <div className="fixed left-0 top-[60px] w-screen bg-[#F5F5F5] shadow-sm">
                      <div className="mx-auto max-w-[1440px] px-8 py-10">
                        <div className="grid grid-cols-4 gap-x-8">

                          {/* Column 1: First Column */}
                          {menuItem.columns?.[0] && (
                            <div>
                              <h3 className="mb-4 text-[12px] font-medium text-[#212121]">
                                {menuItem.columns[0].heading}
                              </h3>
                              <ul className="space-y-3">
                                {menuItem.columns[0].items?.map((item, idx) => (
                                  <li key={idx}>
                                    <Link
                                      to={item.link}
                                      className="text-[12px] text-[#212121] hover:underline"
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Column 2: Second Column */}
                          {menuItem.columns?.[1] && (
                            <div>
                              <h3 className="mb-4 text-[12px] font-medium text-[#212121]">
                                {menuItem.columns[1].heading}
                              </h3>
                              <ul className="space-y-3">
                                {menuItem.columns[1].items?.map((item, idx) => (
                                  <li key={idx}>
                                    <Link
                                      to={item.link}
                                      className="text-[12px] text-[#212121] hover:underline"
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Column 3 & 4: Images */}
                          {menuItem.images && menuItem.images.length > 0 && (
                            <>
                              {menuItem.images.slice(0, 2).map((image, idx) => (
                                <div key={idx} className="relative overflow-hidden bg-gray-100 h-[300px]">
                                  <img
                                    src={image.imageUrl}
                                    alt={image.imageTitle || 'Menu Image'}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      console.error('Image failed to load:', image.imageUrl);
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                    onLoad={() => console.log('Image loaded successfully:', image.imageUrl)}
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity hover:opacity-100" />
                                  <span className="absolute left-4 top-4 text-[12px] font-medium text-white drop-shadow">
                                    {image.imageTitle || 'Menu Image'}
                                  </span>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-[20px] font-light tracking-[0.2em] text-[#212121]">
              431-88
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-x-5">
            <button className="text-[12px] text-[#212121]">7 45</button>
            <button aria-label="Search">
              <Search size={18} strokeWidth={1.5} className="text-[#212121]" />
            </button>
            <Link to="/account" aria-label="Account">
              <User size={18} strokeWidth={1.5} className="text-[#212121]" />
            </Link>
            <Link to="/cart" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} className="text-[#212121]" />
            </Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="ml-2 rounded bg-[#212121] px-3 py-1 text-[12px] text-white hover:bg-gray-800">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <nav className="px-6 py-4">
            <ul className="space-y-4">
              {menuItems.map((menuItem) => (
                <li key={menuItem._id}>
                  <button
                    className="block w-full text-left text-[12px] font-medium text-[#212121]"
                    onClick={() => setActiveMenu(activeMenu === menuItem.slug ? null : menuItem.slug)}
                  >
                    {menuItem.title}
                  </button>
                  {activeMenu === menuItem.slug && (
                    <ul className="mt-3 space-y-3 border-l border-gray-200 pl-4">
                      {menuItem.columns?.map((column) => (
                        <li key={column._id}>
                          <p className="mb-2 text-[12px] font-medium text-[#212121]">{column.heading}</p>
                          <ul className="space-y-2">
                            {column.items?.map((item, idx) => (
                              <li key={idx}>
                                <Link
                                  to={item.link}
                                  className="text-[12px] text-[#212121]"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;