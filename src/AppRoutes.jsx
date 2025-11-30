import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/useStore';
import { useTheme } from './contexts/ThemeContext';
import { HeaderNav, Footer } from './components/layout';
import Toast from './components/ui/Toast';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import About from './pages/About';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Support from './pages/Support';
import Services from './pages/Services';
import Documentation from './pages/Documentation';
import FAQ from './pages/FAQ';

// Admin imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProductsPage from './pages/admin/ProductsPage';
import AdminProductForm from './pages/admin/ProductForm';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));
const AdminSupport = lazy(() => import('./pages/admin/Support'));
const AdminBlogs = lazy(() => import('./pages/admin/Blogs'));
const AdminDownloads = lazy(() => import('./pages/admin/Downloads'));
const AdminLicenses = lazy(() => import('./pages/admin/Licenses'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const AdminPages = lazy(() => import('./pages/admin/Pages'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminActivityLog = lazy(() => import('./pages/admin/ActivityLogPage'));
const AdminTheme = lazy(() => import('./pages/admin/Theme'));
const AdminProfile = lazy(() => import('./pages/admin/Profile'));

// Layout wrapper component
function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {!isAdminRoute && <HeaderNav darkMode={darkMode} setDarkMode={toggleTheme} />}
      {children}
      {!isAdminRoute && <Footer darkMode={darkMode} />}
      <Toast />
    </div>
  );
}

export default function AppRoutes() {
  const [loading, setLoading] = useState(true);
  const { setUser, setSession } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
        setSession(session);
      }

      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-6xl">⚙️</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <RoutesContent />
    </BrowserRouter>
  );
}

// Inner component that has access to theme context
function RoutesContent() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <LayoutWrapper>
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/products" element={<Products darkMode={darkMode} />} />
        <Route path="/products/:slug" element={<ProductDetail darkMode={darkMode} />} />
        <Route path="/categories" element={<Categories darkMode={darkMode} />} />
        <Route path="/categories/:categorySlug" element={<Categories darkMode={darkMode} />} />
        <Route path="/cart" element={<Cart darkMode={darkMode} />} />
        <Route path="/wishlist" element={<Wishlist darkMode={darkMode} />} />
        <Route path="/checkout" element={<Checkout darkMode={darkMode} />} />
        <Route path="/blog" element={<Blog darkMode={darkMode} />} />
        <Route path="/blog/:slug" element={<BlogDetail darkMode={darkMode} />} />
        <Route path="/testimonials" element={<Testimonials darkMode={darkMode} />} />
        <Route path="/contact" element={<Contact darkMode={darkMode} />} />
        <Route path="/about" element={<About darkMode={darkMode} />} />
        <Route path="/search" element={<Search darkMode={darkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/register" element={<Register darkMode={darkMode} />} />
        <Route path="/dashboard" element={<Dashboard darkMode={darkMode} setDarkMode={toggleTheme} />} />
        <Route path="/support" element={<Support darkMode={darkMode} />} />
        <Route path="/support/category/:slug" element={<Support darkMode={darkMode} />} />
        <Route path="/support/article/:slug" element={<Support darkMode={darkMode} />} />
        <Route path="/services" element={<Services darkMode={darkMode} />} />
        <Route path="/docs" element={<Documentation darkMode={darkMode} />} />
        <Route path="/docs/:slug" element={<Documentation darkMode={darkMode} />} />
        <Route path="/faq" element={<FAQ darkMode={darkMode} />} />
        <Route path="/terms" element={<Terms darkMode={darkMode} />} />
        <Route path="/privacy" element={<Privacy darkMode={darkMode} />} />
        <Route path="/refund" element={<Refund darkMode={darkMode} />} />

        {/* Admin Login Route - Secret URL */}
        <Route path="/admin-1253223" element={<AdminLogin />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminOrders />
            </Suspense>
          } />
          <Route path="analytics" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminAnalytics />
            </Suspense>
          } />
          <Route path="support" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminSupport />
            </Suspense>
          } />
          <Route path="blogs" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminBlogs />
            </Suspense>
          } />
          <Route path="downloads" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDownloads />
            </Suspense>
          } />
          <Route path="licenses" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminLicenses />
            </Suspense>
          } />
          <Route path="coupons" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminCoupons />
            </Suspense>
          } />
          <Route path="reviews" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminReviews />
            </Suspense>
          } />
          <Route path="pages" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminPages />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminSettings />
            </Suspense>
          } />
          <Route path="activity" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminActivityLog />
            </Suspense>
          } />
          <Route path="theme" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminTheme />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminProfile />
            </Suspense>
          } />
        </Route>

        <Route path="*" element={<NotFound darkMode={darkMode} />} />
      </Routes>
    </LayoutWrapper>
  );
}
