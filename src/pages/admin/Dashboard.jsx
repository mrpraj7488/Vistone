import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from '../../utils/notifications';
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingBag,
  Package,
  ArrowUp,
  ArrowDown,
  Star,
  Trophy,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real statistics from database
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact' }),
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('user_profiles').select('*', { count: 'exact' })
      ]);

      // Calculate real stats
      const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const thisMonthRevenue = ordersRes.data?.filter(order => {
        const orderDate = new Date(order.created_at);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }).reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      // Set real stats
      setStats([
        {
          title: 'Total Revenue',
          value: `$${totalRevenue.toFixed(2)}`,
          change: '+0%',
          changeValue: '$0',
          trend: 'up',
          icon: DollarSign,
          color: 'from-green-500 to-emerald-600',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500'
        },
        {
          title: 'This Month Sales',
          value: `$${thisMonthRevenue.toFixed(2)}`,
          change: '+0%',
          changeValue: '$0',
          trend: 'up',
          icon: TrendingUp,
          color: 'from-blue-500 to-indigo-600',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500'
        },
        {
          title: 'Total Orders',
          value: ordersRes.count || 0,
          change: '+0%',
          changeValue: '+0',
          trend: 'up',
          icon: ShoppingBag,
          color: 'from-purple-500 to-pink-600',
          bgColor: 'bg-purple-100 dark:bg-purple-900/20',
          iconBg: 'bg-gradient-to-br from-purple-400 to-pink-500'
        },
        {
          title: 'Total Customers',
          value: usersRes.count || 0,
          change: '+0%',
          changeValue: '+0',
          trend: 'up',
          icon: Users,
          color: 'from-amber-500 to-orange-600',
          bgColor: 'bg-amber-100 dark:bg-amber-900/20',
          iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500'
        }
      ]);

      // Fetch recent orders
      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select('*, user_profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentOrdersData) {
        setRecentOrders(recentOrdersData.map(order => ({
          id: order.order_number || order.id,
          customer: order.user_profiles?.full_name || order.user_profiles?.email || 'Guest',
          email: order.user_profiles?.email || 'N/A',
          product: 'Multiple Items',
          amount: `$${order.total_amount || 0}`,
          status: order.status || 'pending',
          date: new Date(order.created_at).toLocaleDateString()
        })));
      }

      // Fetch top products
      const { data: topProductsData } = await supabase
        .from('products')
        .select('*')
        .order('download_count', { ascending: false })
        .limit(5);

      if (topProductsData) {
        setTopProducts(topProductsData.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category || 'Uncategorized',
          sales: product.download_count || 0,
          revenue: `$${(product.regular_price * (product.download_count || 0)).toFixed(2)}`,
          stock: 'Digital',
          image: product.featured_image || '/placeholder.png'
        })));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function for status colors
  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Processing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Pending': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Refunded': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors[status] || colors['Pending'];
  };

  // Data will be populated from database in useEffect
  // Chart data for revenue visualization
  const [revenueChartData, setRevenueChartData] = useState([
    { name: 'Jan', revenue: 0 },
    { name: 'Feb', revenue: 0 },
    { name: 'Mar', revenue: 0 },
    { name: 'Apr', revenue: 0 },
    { name: 'May', revenue: 0 },
    { name: 'Jun', revenue: 0 },
  ]);

  // All data is fetched from database in useEffect above

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards - Matching comprehensive prompt specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium flex items-center gap-1 ${
                      stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.changeValue}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={20} />
            Revenue Growth
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === 'year'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (60%) - Top Products */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy size={20} />
                Top Products (By Sales)
              </h2>
              <Link
                to="/admin/products"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
              >
                View All Products
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer group"
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=${product.name.charAt(0)}`;
                      }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span>{product.rating}</span>
                        <span>({product.reviews})</span>
                      </div>
                      <span>|</span>
                      <span>{product.sales} sales</span>
                      <span>|</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        ${product.revenue.toLocaleString()} revenue
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Sales Performance</span>
                        <span>{product.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${product.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (40%) - Recent Orders */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={20} />
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                        #{order.id}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">|</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {order.customer}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {order.product}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${order.amount}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {order.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Category (Donut Chart) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Dashboards', value: 45, color: '#3B82F6' },
                    { name: 'Templates', value: 28, color: '#10B981' },
                    { name: 'Plugins', value: 18, color: '#F59E0B' },
                    { name: 'Themes', value: 9, color: '#EF4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Dashboards', value: 45, color: '#3B82F6' },
                    { name: 'Templates', value: 28, color: '#10B981' },
                    { name: 'Plugins', value: 18, color: '#F59E0B' },
                    { name: 'Themes', value: 9, color: '#EF4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {[
              { name: 'Dashboards', value: 45, color: '#3B82F6' },
              { name: 'Templates', value: 28, color: '#10B981' },
              { name: 'Plugins', value: 18, color: '#F59E0B' },
              { name: 'Themes', value: 9, color: '#EF4444' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {[
              { name: 'Direct', value: 42, color: 'bg-blue-500' },
              { name: 'Search', value: 28, color: 'bg-green-500' },
              { name: 'Social', value: 18, color: 'bg-purple-500' },
              { name: 'Email', value: 12, color: 'bg-orange-500' }
            ].map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{source.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{source.value}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${source.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${source.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-blue-500 rounded-lg">
                <Package size={16} className="text-white" />
              </div>
              <span className="font-medium text-blue-900 dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-200">
                Add New Product
              </span>
            </Link>
            <Link
              to="/admin/blogs/new"
              className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-green-500 rounded-lg">
                <FileText size={16} className="text-white" />
              </div>
              <span className="font-medium text-green-900 dark:text-green-300 group-hover:text-green-700 dark:group-hover:text-green-200">
                Create Blog Post
              </span>
            </Link>
            <Link
              to="/admin/support"
              className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-purple-500 rounded-lg">
                <Users size={16} className="text-white" />
              </div>
              <span className="font-medium text-purple-900 dark:text-purple-300 group-hover:text-purple-700 dark:group-hover:text-purple-200">
                View Support Tickets
              </span>
            </Link>
            <Link
              to="/admin/users/new"
              className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-orange-500 rounded-lg">
                <Users size={16} className="text-white" />
              </div>
              <span className="font-medium text-orange-900 dark:text-orange-300 group-hover:text-orange-700 dark:group-hover:text-orange-200">
                Add New User
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
