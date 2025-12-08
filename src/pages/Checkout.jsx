import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useUIStore, useAuthStore } from '../store/useStore';
import Button from '../components/ui/Button';
import { Container } from '../components/layout/Container';
import {
  CreditCard, Lock, ShieldCheck, ChevronLeft, Package, Key, Tag, CheckCircle,
  Wallet, ArrowRight, MapPin, User, Mail, Building, Phone, Globe, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  // Calculate subtotal based on displayed prices
  const subtotal = items.reduce((total, item) => {
    const price = item.licenseType === 'yearly' ? item.price_yearly : item.price_monthly || item.regular_price;
    const displayPrice = item.sale_price || price || item.regular_price || 0;
    return total + (Number(displayPrice) * item.quantity);
  }, 0);

  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.18; // 18% tax
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
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

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
      showToast(`Payment completed via ${formData.paymentMethod === 'paypal' ? 'PayPal' : 'Razorpay'}!`, 'success');
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className={`min-h-screen pt-32 pb-20 ${darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}>
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-center mb-8 p-8 rounded-3xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className={`text-3xl md:text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Order Complete!</h1>
              <p className={`text-lg mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Thank you for your purchase. A confirmation email has been sent to {formData.email}.
              </p>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mt-4 ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                Order #{orderDetails.orderNumber}
              </div>
            </motion.div>

            <div className={`rounded-3xl p-8 mb-8 border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Your License Keys
              </h2>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div>
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {item.name}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.licenseType === 'yearly' ? 'Extended' : 'Standard'} License
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${darkMode ? 'bg-black/30 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <Key className="w-5 h-5 text-blue-500 shrink-0" />
                      <code className={`text-sm font-mono flex-1 break-all ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.licenseKey}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.licenseKey);
                          showToast('License key copied!', 'success');
                        }}
                        className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors shrink-0"
                        title="Copy Key"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1 h-12 text-base"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                className="flex-1 h-12 text-base"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-20 ${darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}>
      <Container>
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
          <nav className={`text-sm mb-4 inline-flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <Link to="/cart" className="hover:text-blue-500 transition-colors flex items-center gap-1">
              <ChevronLeft size={14} /> Back to Cart
            </Link>
          </nav>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Checkout
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center relative">
            <div className={`absolute top-1/2 left-0 w-full h-0.5 -z-10 -translate-y-1/2 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            <div className="flex items-center gap-12 sm:gap-24 bg-transparent relative z-10">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400'
                  }`}>
                  1
                </div>
                <span className={`text-xs font-bold ${step >= 1 ? (darkMode ? 'text-white' : 'text-slate-900') : (darkMode ? 'text-slate-600' : 'text-slate-400')}`}>Billing</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400'
                  }`}>
                  2
                </div>
                <span className={`text-xs font-bold ${step >= 2 ? (darkMode ? 'text-white' : 'text-slate-900') : (darkMode ? 'text-slate-600' : 'text-slate-400')}`}>Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`rounded-3xl p-6 sm:p-8 border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}
                  >
                    <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      <User className="text-blue-500" /> Billing Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${darkMode
                              ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white'
                              : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                            } ${errors.firstName ? 'border-red-500' : ''}`}
                          placeholder="John"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${darkMode
                              ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white'
                              : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                            } ${errors.lastName ? 'border-red-500' : ''}`}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${darkMode
                              ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white'
                              : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                            } ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>

                    <div className="mt-6 space-y-2">
                      <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Street Address</label>
                      <div className="relative">
                        <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${darkMode
                              ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white'
                              : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                            } ${errors.address ? 'border-red-500' : ''}`}
                          placeholder="123 Main St"
                        />
                      </div>
                      {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${darkMode
                              ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white'
                              : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                            } ${errors.city ? 'border-red-500' : ''}`}
                        />
                        {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${darkMode
                              ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white'
                              : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                            } ${errors.state ? 'border-red-500' : ''}`}
                        />
                        {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>ZIP Code</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${darkMode
                              ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white'
                              : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                            } ${errors.zip ? 'border-red-500' : ''}`}
                        />
                        {errors.zip && <p className="text-red-500 text-xs">{errors.zip}</p>}
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button type="submit" className="w-full h-12 text-base shadow-lg shadow-blue-500/25 group">
                        <span className="flex items-center gap-2">
                          Continue to Payment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`rounded-3xl p-6 sm:p-8 border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}
                  >
                    <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      <CreditCard className="text-blue-500" /> Payment Method
                    </h2>

                    <div className="space-y-4 mb-8">
                      <label className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'paypal'
                          ? 'border-blue-500 bg-blue-500/5'
                          : darkMode ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                        }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>PayPal</span>
                            <div className="flex gap-2">
                              <div className="h-6 w-10 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white">PayPal</div>
                            </div>
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Safe payment online. Credit card needed.</p>
                        </div>
                      </label>

                      <label className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'razorpay'
                          ? 'border-blue-500 bg-blue-500/5'
                          : darkMode ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                        }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={formData.paymentMethod === 'razorpay'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Razorpay</span>
                            <div className="flex gap-2">
                              <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                              <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold">MC</div>
                            </div>
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pay with Credit Card, UPI, or Net Banking.</p>
                        </div>
                      </label>
                    </div>

                    <div className="mb-8">
                      <label className={`flex items-start gap-3 p-4 rounded-xl border ${darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          I agree to the <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 h-12"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" /> Back
                      </Button>
                      <Button
                        type="submit"
                        loading={loading}
                        disabled={!formData.agreeTerms}
                        className={`flex-1 h-12 text-base shadow-lg shadow-blue-500/25 ${!formData.agreeTerms ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        <Lock className="w-4 h-4 mr-2" /> Pay ${total.toFixed(2)}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96 shrink-0">
            <div className={`sticky top-28 rounded-3xl border p-6 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                      <img src={item.featured_image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {item.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Qty: {item.quantity}
                      </p>
                      <p className={`text-sm font-bold mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Discount code"
                    className={`flex-1 px-3 py-2.5 rounded-xl border outline-none transition-all text-sm ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={applyCoupon}
                    disabled={!couponCode}
                    className="px-4"
                  >
                    Apply
                  </Button>
                </div>
                {discount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-500 text-sm mt-2 bg-green-500/10 p-2 rounded-lg"
                  >
                    <Tag className="w-4 h-4" />
                    <span className="font-bold">{discount}% discount applied!</span>
                  </motion.div>
                )}
              </div>

              <div className={`border-t pt-4 space-y-3 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Subtotal</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Tax (18%)</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>${tax.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between items-end pt-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Total</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={`mt-6 flex items-center gap-3 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <ShieldCheck className="w-4 h-4" />
                <span>Secure SSL Encryption. 100% Safe.</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
