import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NewsletterWithAnnouncement from './components/NewsletterWithAnnouncement';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home'; // Keep Home static for instant viewport load
import ScrollToTop from './components/ScrollToTop';

// Helper to automatically reload the page if a lazy chunk load fails (common after a new deployment)
const safeLazy = (importFunc: () => Promise<{ default: any }>) => {
  return lazy(() => 
    importFunc().catch((err) => {
      console.warn("Dynamic module import failed, forcing page reload:", err);
      window.location.reload();
      return { default: () => null };
    })
  );
};

const safeLazyNamed = (importFunc: () => Promise<any>, name: string) => {
  return lazy(() => 
    importFunc()
      .then(m => ({ default: m[name] }))
      .catch((err) => {
        console.warn(`Dynamic module import failed for ${name}, forcing page reload:`, err);
        window.location.reload();
        return { default: () => null };
      })
  );
};

// Lazy Loaded Public Pages
const Login = safeLazy(() => import('./pages/Login'));
const Pdp = safeLazy(() => import('./pages/Pdp'));
const Collection = safeLazy(() => import('./pages/Collection'));
const Account = safeLazy(() => import('./pages/Account'));
const Checkout = safeLazy(() => import('./pages/Checkout'));
const OrderSuccess = safeLazy(() => import('./pages/OrderSuccess'));
const Faq = safeLazy(() => import('./pages/Faq'));
const PrivacyPolicy = safeLazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = safeLazy(() => import('./pages/TermsOfService'));
const About = safeLazy(() => import('./pages/About'));
const Shipping = safeLazy(() => import('./pages/Shipping'));
const RefundPolicy = safeLazy(() => import('./pages/RefundPolicy'));
const PaymentsPage = safeLazy(() => import('./pages/PaymentsPage'));
const Contact = safeLazy(() => import('./pages/Contact'));

// Lazy Loaded Admin Pages
const Dashboard = safeLazy(() => import('./pages/admin/Dashboard'));
const MenuManager = safeLazyNamed(() => import('./pages/admin/MenuManager'), 'MenuManager');
const BannerManager = safeLazyNamed(() => import('./pages/admin/BannerManager'), 'BannerManager');
const ProductManager = safeLazyNamed(() => import('./pages/admin/ProductManager'), 'ProductManager');
const OrderManager = safeLazyNamed(() => import('./pages/admin/OrderManager'), 'OrderManager');

/* Shared layout for all public-facing pages: Navbar + content + Newsletter + Footer */
const PublicLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${isHome ? '' : 'pt-[60px]'}`}>
        <Outlet />
      </main>
      <NewsletterWithAnnouncement />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-white font-['Poppins']">
                <div className="w-8 h-8 border-2 border-[#212121]/20 border-t-[#212121] rounded-full animate-spin" />
              </div>
            }>
              <Routes>
                {/* Standalone Login page (no Navbar/Footer) */}
                <Route path="/login" element={<Login />} />

                {/* Admin Routes (protected, no public layout) */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="menu" element={<MenuManager />} />
                  <Route path="banners" element={<BannerManager />} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="orders" element={<OrderManager />} />
                </Route>

                {/* Public Routes — all share Navbar + Footer */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/policies/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/policies/terms-of-service" element={<TermsOfService />} />
                  <Route path="/:menuSlug" element={<Collection />} />
                  <Route path="/:menuSlug/:itemSlug" element={<Collection />} />
                  <Route path="/products/:slug" element={<Pdp />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:id" element={<OrderSuccess />} />
                </Route>
              </Routes>
            </Suspense>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
