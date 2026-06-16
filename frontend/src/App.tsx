import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NewsletterWithAnnouncement from './components/NewsletterWithAnnouncement';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import {MenuManager} from './pages/admin/MenuManager';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
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
          </Route>

          {/* Public Pages */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold">Welcome to 431-88</h1>
                    <p className="mt-4 text-gray-600">Dynamic mega menu e-commerce store</p>
                  </div>
                </main>
                <NewsletterWithAnnouncement />
                <Footer />
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
