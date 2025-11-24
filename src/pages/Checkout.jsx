import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useUIStore, useAuthStore } from '../store/useStore';
import Button from '../components/ui/Button';
import { CreditCard, Lock, ShieldCheck, ChevronLeft, Package, Key, Tag, CheckCircle, Wallet } from 'lucide-react';

export default function Checkout({ darkMode }) {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    company: '',
    country: 'United States',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    orderNotes: '',
    paymentMethod: 'paypal',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  const subtotal = getTotal();
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.1; // 10% tax
  const total = subtotal - discountAmount + tax;

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [items, navigate, orderComplete]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip) newErrors.zip = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyCoupon = () => {
    // Simulate coupon validation
    if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
      showToast('Coupon applied! 20% discount', 'success');
    } else if (couponCode.toUpperCase() === 'FIRST10') {
      setDiscount(10);
      showToast('Coupon applied! 10% discount', 'success');
    } else {
      showToast('Invalid coupon code', 'error');
    }
  };

  const processPayment = async () => {
    setLoading(true);

    try {
      if (formData.paymentMethod === 'paypal') {
        // Redirect to PayPal
        showToast('Redirecting to PayPal...', 'info');
        // In production, integrate with PayPal SDK
        // window.location.href = paypalCheckoutUrl;
      } else if (formData.paymentMethod === 'razorpay') {
        // Initialize Razorpay
        showToast('Initializing Razorpay...', 'info');
        // In production, integrate with Razorpay SDK
        // const razorpay = new window.Razorpay(options);
        // razorpay.open();
      }

      // Simulate payment processing for demo
      setTimeout(() => {
        // Generate order details
        const order = {
          orderNumber: `ORD-${Date.now()}`,
          date: new Date().toISOString(),
          paymentMethod: formData.paymentMethod,
          items: items.map(item => ({
            ...item,
            licenseKey: `LIC-${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          })),
          total: total,
          billingInfo: formData
        };

        setOrderDetails(order);
        setOrderComplete(true);
        clearCart();
        setLoading(false);
        showToast(`Payment completed via ${formData.paymentMethod}!`, 'success');
      }, 2000);
    } catch (error) {
      setLoading(false);
      showToast('Payment failed. Please try again.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (!formData.agreeTerms) {
        showToast('Please agree to the terms and conditions', 'error');
        return;
      }
      await processPayment();
    }
  };

  if (orderComplete && orderDetails) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-8 p-8 rounded-2xl ${darkMode ? 'glass-dark' : 'glass-light'}`}>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-black mb-4 text-gradient">Order Complete!</h1>
            <p className={`text-xl mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Thank you for your purchase
            </p>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Order Number: {orderDetails.orderNumber}
            </p>
          </div>

          <div className={`rounded-2xl p-8 mb-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your License Keys
            </h2>
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div key={item.id} className={`p-4 rounded-xl border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.licenseType || 'Regular'} License
                      </p>
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${item.price}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Key className="w-5 h-5 text-cyan-500" />
                    <code className="text-sm font-mono flex-1">{item.licenseKey}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.licenseKey);
                        showToast('License key copied!', 'success');
                      }}
                      className="text-cyan-500 hover:text-cyan-600"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/products')}
              className="flex-1"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <Link to="/cart" className="hover:text-cyan-500">Cart</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Checkout</span>
        </nav>

        <h1 className="text-5xl font-black mb-8 text-gradient">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
              step >= 1 ? 'bg-cyan-500 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-cyan-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
              step >= 2 ? 'bg-cyan-500 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className={`rounded-2xl p-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Billing Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                          darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                        } ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                          darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                        } ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                        darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                      } ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="mt-6">
                    <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                        darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="mt-6">
                    <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                        darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                      } ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                          darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                        } ${errors.city ? 'border-red-500' : ''}`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                          darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                        } ${errors.state ? 'border-red-500' : ''}`}
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                          darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                        } ${errors.zip ? 'border-red-500' : ''}`}
                      />
                      {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <Link to="/cart" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Back to Cart
                      </Button>
                    </Link>
                    <Button type="submit" className="flex-1">
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={`rounded-2xl p-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Payment Method
                  </h2>

                  <div className="space-y-4 mb-6">
                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'paypal' 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : darkMode ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                        className="w-5 h-5"
                      />
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                        P
                      </div>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        PayPal
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`}>
                        Recommended
                      </span>
                    </label>

                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'razorpay' 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : darkMode ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={handleInputChange}
                        className="w-5 h-5"
                      />
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                        R
                      </div>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Razorpay
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Cards, UPI, Wallets
                      </span>
                    </label>
                  </div>

                  {formData.paymentMethod === 'paypal' && (
                    <div className={`p-6 rounded-xl mb-6 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-3">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Secure PayPal Payment</span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        You will be redirected to PayPal to complete your payment securely. No credit card information is stored on our servers.
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'razorpay' && (
                    <div className={`p-6 rounded-xl mb-6 ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-3">
                        <Wallet className="w-4 h-4" />
                        <span className="text-sm font-medium">Multiple Payment Options</span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                        Pay using Credit/Debit Cards, UPI, Net Banking, or Digital Wallets. All payments are processed securely through Razorpay.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Visa</span>
                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Mastercard</span>
                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">UPI</span>
                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Wallets</span>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className={`flex items-start gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className="w-5 h-5 mt-1"
                      />
                      <span className="text-sm">
                        I agree to the{' '}
                        <Link to="/terms" className="text-cyan-500 hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-cyan-500 hover:underline">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={!formData.agreeTerms}
                      className="flex-1"
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      Complete Order
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 sticky top-24 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className={`block mb-2 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className={`flex-1 px-3 py-2 rounded-lg border-2 outline-none transition-all text-sm ${
                      darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                    }`}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={applyCoupon}
                    disabled={!couponCode}
                  >
                    Apply
                  </Button>
                </div>
                {discount > 0 && (
                  <p className="text-green-500 text-sm mt-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    {discount}% discount applied!
                  </p>
                )}
              </div>

              <div className={`border-t pt-4 space-y-2 ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Tax (10%)</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>${tax.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-xl font-bold pt-2 border-t ${darkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-900'}`}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-medium">Secure Checkout</span>
                </div>
                <p className={`text-xs mt-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  Your payment information is encrypted and secure. We never store your credit card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
