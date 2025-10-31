import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useWishlistStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';

export default function Cart({ darkMode }) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const showToast = useUIStore((state) => state.showToast);
  const navigate = useNavigate();

  const subtotal = getTotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleMoveToWishlist = (item) => {
    addToWishlist(item);
    removeItem(item.id, item.licenseType);
    showToast('Moved to wishlist!', 'success');
  };

  const handleRemove = (item) => {
    removeItem(item.id, item.licenseType);
    showToast('Removed from cart', 'info');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your cart is empty
          </h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Looks like you haven't added anything to your cart yet
          </p>
          <Link to="/products">
            <Button>Start Shopping</Button>
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
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Cart</span>
        </nav>

        <h1 className={`text-4xl font-black mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Shopping Cart
          <span className={`ml-4 text-2xl ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            ({items.length} items)
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.licenseType === 'yearly' ? item.price_yearly : item.price_monthly;
              return (
                <div
                  key={`${item.id}-${item.licenseType}`}
                  className={`rounded-2xl p-6 ${darkMode ? 'glass-dark' : 'glass-light'}`}
                >
                  <div className="flex gap-6">
                    <img
                      src={item.featured_image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <Link
                          to={`/products/${item.slug}`}
                          className={`text-xl font-bold hover:text-cyan-500 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-red-500 hover:text-red-600 text-xl"
                        >
                          ✕
                        </button>
                      </div>

                      <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        License: {item.licenseType === 'yearly' ? 'Multi Site' : 'Single Site'}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-yellow-400">
                          {'⭐'.repeat(Math.floor(item.rating_average))}
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.rating_average}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => updateQuantity(item.id, item.licenseType, item.quantity - 1)}
                            className={`w-8 h-8 rounded-lg font-bold ${
                              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            -
                          </button>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.licenseType, item.quantity + 1)}
                            className={`w-8 h-8 rounded-lg font-bold ${
                              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            ${price} × {item.quantity}
                          </div>
                          <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                            ${(price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className={`mt-4 text-sm font-bold ${
                          darkMode ? 'text-cyan-400' : 'text-cyan-600'
                        } hover:underline`}
                      >
                        ❤️ Move to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 sticky top-24 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Subtotal:</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Tax (18%):</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                  <div className={`flex justify-between text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <span>Total:</span>
                    <span className="text-cyan-500">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full mb-4"
              >
                Proceed to Checkout
              </Button>

              <Link to="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              <div className={`mt-6 text-center text-sm space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div>✓ Secure Checkout</div>
                <div>✓ Money-back Guarantee</div>
                <div className="flex justify-center gap-2 mt-4">
                  <span>💳</span>
                  <span>Visa</span>
                  <span>MC</span>
                  <span>PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
