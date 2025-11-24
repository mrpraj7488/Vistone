import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';

export default function Login({ darkMode }) {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const showToast = useUIStore((state) => state.showToast);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      showToast(error.message, 'error');
      setLoading(false);
    } else {
      setUser(data.user);
      setSession(data.session);
      showToast('Welcome back!', 'success');
      navigate('/');
    }
  };

  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) showToast(error.message, 'error');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <div className={`rounded-2xl p-8 shadow-2xl ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">
              🔐
            </div>
            <h1 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome Back!
            </h1>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Email Address
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
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                  errors.password
                    ? 'border-red-500'
                    : darkMode
                    ? 'glass-dark border-cyan-500/30 text-white'
                    : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Remember me
                </span>
              </label>
              <Link
                to="/reset-password"
                className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className={`relative my-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
            </div>
            <span className={`relative px-4 text-sm ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              Or sign in with
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className={`p-3 rounded-lg font-bold transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              G
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              className={`p-3 rounded-lg font-bold transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              f
            </button>
            <button
              onClick={() => handleSocialLogin('github')}
              className={`p-3 rounded-lg font-bold transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              GitHub
            </button>
          </div>

          <div className={`text-center mt-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <Link to="/register" className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
