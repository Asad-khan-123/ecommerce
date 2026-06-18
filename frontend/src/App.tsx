import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NewsletterWithAnnouncement from './components/NewsletterWithAnnouncement';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Pdp from './pages/Pdp';
import Collection from './pages/Collection';
import Account from './pages/Account';
import Dashboard from './pages/admin/Dashboard';
import { MenuManager } from './pages/admin/MenuManager';
import { BannerManager } from './pages/admin/BannerManager';
import { ProductManager } from './pages/admin/ProductManager';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { OrderManager } from './pages/admin/OrderManager';

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
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
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
                <Route path="/:menuSlug" element={<Collection />} />
                <Route path="/:menuSlug/:itemSlug" element={<Collection />} />
                <Route path="/products/:slug" element={<Pdp />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
              </Route>
            </Routes>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
