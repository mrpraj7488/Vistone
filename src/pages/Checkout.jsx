import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';

export default function Checkout({ darkMode }) {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const showToast = useUIStore((state) => state.showToast);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
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
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  const subtotal = getTotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

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
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip) newErrors.zip = 'ZIP code is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardName) newErrors.cardName = 'Name on card is required';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCvv) newErrors.cardCvv = 'CVV is required';
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    if (validateStep2()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        clearCart();
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your cart is empty
          </h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Add products to your cart before checking out
          </p>
          <Link to="/products">
            <Button>Browse Products</Button>
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
          <Link to="/cart" className="hover:text-cyan-500">Cart</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Checkout</span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${
              step >= 1 ? 'text-cyan-500' : darkMode ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-cyan-500 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="hidden sm:inline font-bold">Information</span>
            </div>
            <div className={`h-1 w-16 ${
              step >= 2 ? 'bg-cyan-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`flex items-center gap-2 ${
              step >= 2 ? 'text-cyan-500' : darkMode ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-cyan-500 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span className="hidden sm:inline font-bold">Payment</span>
            </div>
            <div className={`h-1 w-16 ${
              step >= 3 ? 'bg-cyan-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`flex items-center gap-2 ${
              step >= 3 ? 'text-cyan-500' : darkMode ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? 'bg-cyan-500 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 3 ? '✓' : '3'}
              </div>
              <span className="hidden sm:inline font-bold">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className={`rounded-2xl p-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Contact Information
                </h2>

                <div className="mb-6">
                  <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.email ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Billing Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.firstName ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
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
                      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.lastName ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                  />
                </div>

                <div className="mb-4">
                  <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Country/Region *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.address ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="mb-4">
                  <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Apartment, suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.city ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
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
                      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.state ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
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
                      className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.zip ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                    />
                    {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.phone ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <Button onClick={handleContinueToPayment} className="w-full">
                  Continue to Payment →
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className={`rounded-2xl p-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Payment Method
                </h2>

                <div className="space-y-4 mb-6">
                  <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Credit/Debit Card
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Visa, Mastercard, Amex
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'paypal'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        PayPal
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Fast and secure
                      </div>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.cardNumber ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.cardName ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                      />
                      {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.cardExpiry ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                        />
                        {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.cardCvv ? 'border-red-500' : darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                        />
                        {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5"
                    />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      I agree to the{' '}
                      <Link to="/terms" className="text-cyan-500 hover:underline">
                        Terms & Conditions
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-cyan-500 hover:underline">
                        Privacy Policy
                      </Link>
                      {' '}*
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    ← Back
                  </Button>
                  <Button onClick={handlePlaceOrder} loading={loading} className="flex-1">
                    Place Order ${total.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={`rounded-2xl p-12 text-center ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <div className="text-8xl mb-6 animate-bounce">✓</div>
                <h2 className={`text-4xl font-black mb-4 text-gradient`}>
                  Order Successful!
                </h2>
                <p className={`text-xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Thank you for your purchase!
                </p>
                <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <p className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Order Number: #ORD-{Date.now().toString().slice(-8)}
                  </p>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    A confirmation email has been sent to {formData.email}
                  </p>
                </div>
                <div className="space-y-4">
                  <Button onClick={() => navigate('/products')} className="w-full">
                    Continue Shopping
                  </Button>
                  <button
                    onClick={() => navigate('/')}
                    className={`block w-full text-center ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 sticky top-24 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const price = item.licenseType === 'yearly' ? item.price_yearly : item.price_monthly;
                  return (
                    <div key={`${item.id}-${item.licenseType}`} className="flex gap-4">
                      <img
                        src={item.featured_image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Qty: {item.quantity}
                        </p>
                        <p className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          ${(price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`space-y-3 mb-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Subtotal:</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Tax (18%):</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-xl font-bold pt-3 border-t ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
                  <span>Total:</span>
                  <span className="text-cyan-500">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className={`text-center space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div>✓ Secure Checkout</div>
                <div>✓ 30-Day Money-back Guarantee</div>
                <div className="flex justify-center gap-2 mt-4 text-lg">
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
