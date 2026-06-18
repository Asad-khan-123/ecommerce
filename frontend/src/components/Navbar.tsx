import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { menuApi, productApi } from '../utils/api';
import { User, Search, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import type { Product } from '../context/ProductContext';
import ProductCard from './ProductCard';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setCartOpen } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Search popup states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);

  // Scroll event listener to handle transparent to solid background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search & mobile menu when location changes
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [location.pathname]);

  // Debounced Search query handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await productApi.getProducts({ search: searchQuery.trim(), limit: 8 });
        if (res.success && res.data) {
          setSearchResults(res.data);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Search query API error:', err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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
      <header className="fixed top-0 left-0 w-full z-40 h-[60px] bg-white font-['Poppins'] border-b border-[#E8E8E8]">
        <div className="mx-auto flex h-full max-w-[1440px] items-center px-8">
          <span className="text-[12px] text-[#212121]">Loading...</span>
        </div>
      </header>
    );
  }

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled && !activeMenu;
  const textColorClass = isTransparent ? 'text-white' : 'text-[#212121]';

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 font-['Poppins'] ${
      isTransparent ? 'bg-transparent border-b border-transparent' : 'bg-white shadow-sm border-b border-[#E8E8E8]'
    }`}>
      <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
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
                    className={`text-[12px] hover:underline hover:underline-offset-[6px] hover:decoration-current transition-colors duration-300 ${textColorClass}`}
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={20} strokeWidth={1.5} className={`transition-colors duration-300 ${textColorClass}`} />
            ) : (
              <Menu size={20} strokeWidth={1.5} className={`transition-colors duration-300 ${textColorClass}`} />
            )}
          </button>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className={`text-[20px] font-bold transition-colors duration-300 ${textColorClass}`}>
              I AM TROUBLE
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-x-3 lg:gap-x-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search" 
              className="p-1 hover:opacity-75 transition-opacity"
            >
              <Search size={18} strokeWidth={1.5} className={`transition-colors duration-300 ${textColorClass}`} />
            </button>
            {user ? (
              <>
                {/* Desktop-only view: My Orders text link & Logout icon */}
                <div className="hidden lg:flex items-center gap-x-5">
                  <Link
                    to="/account"
                    className={`text-[11px] font-semibold tracking-wider uppercase hover:underline whitespace-nowrap transition-colors duration-300 ${textColorClass}`}
                    title="My Orders & Profile"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    aria-label="Logout"
                    title="Logout"
                    className={`p-1 hover:opacity-70 transition-colors duration-300 ${textColorClass}`}
                  >
                    <LogOut size={18} strokeWidth={1.5} />
                  </button>
                </div>
                {/* Mobile-only view: User icon linking directly to Account dashboard */}
                <Link to="/account" className="lg:hidden p-1 hover:opacity-75 transition-opacity" aria-label="Account" title="My Account">
                  <User size={18} strokeWidth={1.5} className={`transition-colors duration-300 ${textColorClass}`} />
                </Link>
              </>
            ) : (
              <Link to="/account" className="p-1 hover:opacity-75 transition-opacity" aria-label="Account" title="Login / Register">
                <User size={18} strokeWidth={1.5} className={`transition-colors duration-300 ${textColorClass}`} />
              </Link>
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-1 transition-opacity hover:opacity-75"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} className={`transition-colors duration-300 ${textColorClass}`} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#212121] text-[8px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="hidden lg:inline-block rounded bg-[#212121] px-3 py-1 text-[12px] text-white hover:bg-gray-800 transition-colors">
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
              {/* Auth details for mobile menu */}
              <li className="pt-4 border-t border-gray-150 space-y-4">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      className="block text-[12px] font-medium uppercase tracking-wider text-[#212121]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Account / Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block text-[12px] font-medium uppercase tracking-wider text-[#212121]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        navigate('/');
                      }}
                      className="block w-full text-left text-[12px] font-medium uppercase tracking-wider text-red-600"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/account"
                    className="block text-[12px] font-medium uppercase tracking-wider text-[#212121]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In / Register
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Cart Drawer Panel */}
      <CartDrawer />

      {/* Search Bar Popup Overlay */}
      {isSearchOpen && (
        <>
          {/* Backdrop blurring overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
          />

          {/* Search container popup sliding from top */}
          <div className="fixed inset-x-0 top-0 z-50 bg-white shadow-xl border-b border-gray-250 flex flex-col font-['Poppins'] animate-slide-down transition-all">
            {/* Header row covering full width, slightly taller than navbar */}
            <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
              <div className="flex h-[80px] items-center justify-between">
                <div className="flex flex-1 items-center gap-3">
                  <Search size={18} strokeWidth={1.5} className="text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for items, collections, styles..."
                    className="w-full text-[14px] font-light outline-none text-[#212121] bg-transparent"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="ml-4 p-2 hover:bg-neutral-100 rounded-full text-[#212121] transition-colors"
                  aria-label="Close search"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Results popup area dropdown */}
            {searchQuery.trim().length > 0 && (
              <div className="bg-white border-t border-gray-100 max-h-[70vh] overflow-y-auto w-full px-4 lg:px-8 py-8">
                <div className="mx-auto max-w-[1440px]">
                  {searching ? (
                    <div className="flex items-center justify-center py-16 gap-3">
                      <span className="w-5 h-5 border-2 border-neutral-350 border-t-[#212121] rounded-full animate-spin" />
                      <span className="text-[12px] text-gray-500">Searching products...</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-[12px] text-gray-400">No products found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-450 mb-6 font-semibold">
                        Search Results ({searchResults.length})
                      </h3>
                      {/* Product Grid - matching normal product styling exactly (zero-gap) */}
                      <div className="grid grid-cols-2 gap-0 lg:grid-cols-4 bg-white border border-[#E8E8E8]">
                        {searchResults.map((product) => (
                          <div 
                            key={product._id} 
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                          >
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;