import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { menuApi } from '../utils/api';
import { User, Search, ShoppingBag, Menu, X } from 'lucide-react';
import { CartDrawer } from './CartDrawer';

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
  const { cartCount, setCartOpen } = useCart();
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

                  {/* Mega Menu Dropdown - FULL HEIGHT FIX */}
                  {activeMenu === menuItem.slug && (
                    <div className="fixed left-0 top-[60px] w-screen bg-[#F5F5F5] h-[calc(85vh-60px)]">
                      {/* h-[calc(100vh-60px)] = Navbar ke neeche se screen ke end tak */}
                      <div className="mx-auto h-full max-w-[1440px]">
                        <div className="grid h-full grid-cols-4 gap-0">
                          {/* gap-0 = images ke beech 0 gap */}

                          {/* Column 1: First Column */}
                          {menuItem.columns?.[0] && (
                            <div className="px-8 py-10">
                              <h3 className="mb-4 text-[12px] font-medium text-[#212121]">
                                {menuItem.columns[0].heading}
                              </h3>
                              <ul className="space-y-3">
                                {menuItem.columns[0].items?.map((item, idx) => {
                                  // Build correct link: if link doesn't start with parent menu slug, prepend it
                                  let fullLink = item.link || '';
                                  if (!fullLink.startsWith('/')) {
                                    fullLink = '/' + fullLink;
                                  }
                                  // If link is just one segment like "/flora", prepend menu slug
                                  const linkParts = fullLink.split('/').filter(Boolean);
                                  if (linkParts.length === 1) {
                                    fullLink = `/${menuItem.slug}/${linkParts[0]}`;
                                  }
                                  return (
                                    <li key={idx}>
                                      <Link
                                        to={fullLink}
                                        className="text-[12px] text-[#212121] hover:underline"
                                      >
                                        {item.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}

                          {/* Column 2: Second Column */}
                          {menuItem.columns?.[1] && (
                            <div className="px-8 py-10">
                              <h3 className="mb-4 text-[12px] font-medium text-[#212121]">
                                {menuItem.columns[1].heading}
                              </h3>
                              <ul className="space-y-3">
                                {menuItem.columns[1].items?.map((item, idx) => {
                                  // Build correct link: if link doesn't start with parent menu slug, prepend it
                                  let fullLink = item.link || '';
                                  if (!fullLink.startsWith('/')) {
                                    fullLink = '/' + fullLink;
                                  }
                                  // If link is just one segment like "/flora", prepend menu slug
                                  const linkParts = fullLink.split('/').filter(Boolean);
                                  if (linkParts.length === 1) {
                                    fullLink = `/${menuItem.slug}/${linkParts[0]}`;
                                  }
                                  return (
                                    <li key={idx}>
                                      <Link
                                        to={fullLink}
                                        className="text-[12px] text-[#212121] hover:underline"
                                      >
                                        {item.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}

                          {/* Column 3 & 4: Images - FULL HEIGHT + NO GAP */}
                          {menuItem.images && menuItem.images.length > 0 && (
                            <>
                              {menuItem.images.slice(0, 2).map((image, idx) => (
                                <div key={idx} className="relative h-full overflow-hidden bg-gray-100">
                                  {/* h-full = puri height le lega */}
                                  <img
                                    src={image.imageUrl}
                                    alt={image.imageTitle || 'Menu Image'}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      console.error('Image failed to load:', image.imageUrl);
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/10 transition-opacity hover:bg-black/20" />
                                  <span className="absolute left-6 top-6 text-[14px] font-medium text-white drop-shadow-lg">
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

          {/* Baaki ka code same rahega... */}

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
            <Link to="/" className="text-[20px] font-bold text-[#212121]">
              I AM TROUBLE
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
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-1 -m-1 transition-opacity hover:opacity-75"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} className="text-[#212121]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#212121] text-[8px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
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
                            {column.items?.map((item, idx) => {
                              // Build correct link: if link doesn't start with parent menu slug, prepend it
                              let fullLink = item.link || '';
                              if (!fullLink.startsWith('/')) {
                                fullLink = '/' + fullLink;
                              }
                              // If link is just one segment like "/flora", prepend menu slug
                              const linkParts = fullLink.split('/').filter(Boolean);
                              if (linkParts.length === 1) {
                                fullLink = `/${menuItem.slug}/${linkParts[0]}`;
                              }
                              return (
                                <li key={idx}>
                                  <Link
                                    to={fullLink}
                                    className="text-[12px] text-[#212121]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              );
                            })}
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
      {/* Cart Drawer Panel */}
      <CartDrawer />
    </header>
  );
};

export default Navbar;