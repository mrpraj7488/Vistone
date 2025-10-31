import { Link } from 'react-router-dom';
import { useWishlistStore, useCartStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';

export default function Wishlist({ darkMode }) {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const showToast = useUIStore((state) => state.showToast);

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast('Added to cart!', 'success');
  };

  const handleRemove = (productId) => {
    removeItem(productId);
    showToast('Removed from wishlist', 'info');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-8xl mb-6">❤️</div>
          <h1 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your wishlist is empty
          </h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Save your favorite products for later
          </p>
          <Link to="/products">
            <Button>Discover Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Wishlist</span>
        </nav>

        <h1 className={`text-4xl font-black mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          My Wishlist
          <span className={`ml-4 text-2xl ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            ({items.length} items)
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((product) => (
            <div
              key={product.id}
              className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                darkMode ? 'glass-dark' : 'glass-light'
              }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.featured_image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <Link
                  to={`/products/${product.slug}`}
                  className={`text-xl font-bold mb-2 hover:text-cyan-500 block ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {product.name}
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-400">
                    {'⭐'.repeat(Math.floor(product.rating_average))}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {product.rating_average}
                  </span>
                </div>

                <div className={`text-2xl font-black mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  ${product.price_monthly}
                  <span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    /mo
                  </span>
                </div>

                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full"
                >
                  🛒 Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
