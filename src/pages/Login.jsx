import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Github, Chrome, Facebook, LogIn } from 'lucide-react';

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
    <div className={`min-h-screen pt-20 pb-20 flex items-center justify-center px-4 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b ${darkMode ? 'from-blue-900/20 to-transparent' : 'from-blue-100/50 to-transparent'}`} />
        <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-blue-500' : 'bg-blue-300'}`} />
        <div className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-purple-500' : 'bg-purple-300'}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className={`rounded-3xl p-8 md:p-10 shadow-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}>
              <LogIn size={32} />
            </div>
            <h1 className={`text-3xl font-black mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Welcome Back
            </h1>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${errors.email
                    ? 'border-red-500 focus:border-red-500'
                    : darkMode
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                    }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className={`text-xs font-bold ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : darkMode
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                    }`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.rememberMe
                  ? 'bg-blue-600 border-blue-600'
                  : darkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-white'
                  }`}>
                  {formData.rememberMe && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </div>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className={`text-sm font-medium ${darkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-800'}`}>
                  Remember me for 30 days
                </span>
              </label>
            </div>

            <div className="relative group">
              <div className={`absolute -inset-0.5 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                }`}></div>
              <Button
                type="submit"
                loading={loading}
                className={`relative w-full h-12 text-base font-bold overflow-hidden transition-all duration-300 ${darkMode
                    ? '!bg-slate-900 !text-white border border-slate-700 hover:!bg-slate-800'
                    : '!bg-white !text-slate-900 border border-slate-200 hover:!bg-slate-50'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Sign In <ArrowRight size={18} />
                </span>
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'
                  }`} />
              </Button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>
            </div>
            <div className="relative flex justify-center">
              <span className={`px-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}`}>
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className={`flex items-center justify-center p-3 rounded-xl border transition-all hover:-translate-y-1 ${darkMode
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                }`}
            >
              <Chrome size={20} />
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              className={`flex items-center justify-center p-3 rounded-xl border transition-all hover:-translate-y-1 ${darkMode
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                }`}
            >
              <Facebook size={20} />
            </button>
            <button
              onClick={() => handleSocialLogin('github')}
              className={`flex items-center justify-center p-3 rounded-xl border transition-all hover:-translate-y-1 ${darkMode
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                }`}
            >
              <Github size={20} />
            </button>
          </div>

          <div className={`text-center mt-8 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Don't have an account?{' '}
              <Link to="/register" className={`font-bold transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
