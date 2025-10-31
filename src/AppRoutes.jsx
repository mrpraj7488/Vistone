import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import Footer from './components/Footer';
import Toast from './components/ui/Toast';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
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

export default function AppRoutes() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full overflow-x-hidden">
        <HeaderNav darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/products" element={<Products darkMode={darkMode} />} />
          <Route path="/products/:slug" element={<ProductDetail darkMode={darkMode} />} />
          <Route path="/cart" element={<Cart darkMode={darkMode} />} />
          <Route path="/wishlist" element={<Wishlist darkMode={darkMode} />} />
          <Route path="/checkout" element={<Checkout darkMode={darkMode} />} />
          <Route path="/blog" element={<Blog darkMode={darkMode} />} />
          <Route path="/blog/:slug" element={<BlogDetail darkMode={darkMode} />} />
          <Route path="/testimonials" element={<Testimonials darkMode={darkMode} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} />} />
          <Route path="/search" element={<Search darkMode={darkMode} />} />
          <Route path="/terms" element={<Terms darkMode={darkMode} />} />
          <Route path="/privacy" element={<Privacy darkMode={darkMode} />} />
          <Route path="/refund" element={<Refund darkMode={darkMode} />} />
          <Route path="*" element={<NotFound darkMode={darkMode} />} />
        </Routes>
        <Footer darkMode={darkMode} />
        <Toast />
      </div>
    </BrowserRouter>
  );
}
