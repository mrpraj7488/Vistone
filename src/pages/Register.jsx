import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import CountrySelect from '../components/common/CountrySelect';

export default function Register({ darkMode }) {
  const navigate = useNavigate();
  const showToast = useUIStore((state) => state.showToast);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    country: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password') {
      calculatePasswordStrength(value);
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCountryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));

    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: '' }));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          company: formData.company,
          phone: formData.phone,
          country: formData.country,
        },
      },
    });

    if (error) {
      showToast(error.message, 'error');
      setLoading(false);
    } else {
      showToast('Account created! Please check your email for verification.', 'success');
      navigate('/verify-email');
    }
  };

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <div className={`rounded-2xl p-8 shadow-2xl ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">
              ✨
            </div>
            <h1 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Create Account
            </h1>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Join thousands of satisfied customers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                  errors.fullName
                    ? 'border-red-500'
                    : darkMode
                    ? 'glass-dark border-cyan-500/30 text-white'
                    : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                  errors.email
                    ? 'border-red-500'
                    : darkMode
                    ? 'glass-dark border-cyan-500/30 text-white'
                    : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                  errors.password
                    ? 'border-red-500'
                    : darkMode
                    ? 'glass-dark border-cyan-500/30 text-white'
                    : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-300'
                        }`}
                      ></div>
                    ))}
                  </div>
                  {passwordStrength > 0 && (
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Strength: {strengthLabels[passwordStrength - 1]}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                  errors.confirmPassword
                    ? 'border-red-500'
                    : darkMode
                    ? 'glass-dark border-cyan-500/30 text-white'
                    : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Company (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                  darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Phone (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                  darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Country (Optional)
              </label>
              <CountrySelect
                value={formData.country}
                onChange={handleCountryChange}
                error={errors.country}
                placeholder="Select your country"
                className={`w-full ${
                  darkMode ? '[&>select]:glass-dark [&>select]:border-cyan-500/30 [&>select]:text-white' : '[&>select]:glass-light [&>select]:border-gray-200 [&>select]:text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4"
                />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  I agree to the{' '}
                  <Link to="/terms" className="text-cyan-500 hover:underline font-bold">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-cyan-500 hover:underline font-bold">
                    Privacy Policy
                  </Link>
                  {' '}*
                </span>
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>

          <div className={`text-center mt-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
