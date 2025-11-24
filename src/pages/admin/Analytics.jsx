import React, { useState, useEffect } from 'react';
import {
  Eye,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  Globe,
  Users,
  Package,
  Activity,
  BarChart3,
  PieChart,
  Map,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Zap,
  Award,
  MapPin,
  Share2,
  Target,
  Layers,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Settings,
  Info,
  ExternalLink,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import { toast } from '../../utils/notifications';
import { supabase } from '../../lib/supabase';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('last7days');
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 45,
    recentCarts: 3,
    recentPurchases: 2
  });

  const [revenueData, setRevenueData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Auto-refresh for real-time data
  useEffect(() => {
    fetchAnalyticsData();
    
    // Simulate real-time data updates
    const interval = setInterval(() => {
      if (autoRefresh) {
        setRealtimeData(prev => ({
          activeUsers: Math.floor(Math.random() * 100) + 20,
          recentCarts: Math.floor(Math.random() * 10),
          recentPurchases: Math.floor(Math.random() * 5)
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch orders for revenue data
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch products for top products
      const { data: products } = await supabase
        .from('products')
        .select('name, view_count, download_count, regular_price')
        .order('download_count', { ascending: false })
        .limit(5);

      // Transform data for charts
      if (orders) {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        }).reverse();

        const revenueByDay = last7Days.map(day => {
          const dayOrders = orders.filter(order => 
            new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'short' }) === day
          );
          return {
            date: day,
            revenue: dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
            orders: dayOrders.length,
            products: dayOrders.length * 2 // Estimate
          };
        });
        setRevenueData(revenueByDay);
      }

      if (products) {
        const transformedProducts = products.map((product, index) => ({
          rank: index + 1,
          name: product.name,
          views: product.view_count || 0,
          sales: product.download_count || 0,
          revenue: (product.regular_price || 0) * (product.download_count || 0)
        }));
        setTopProducts(transformedProducts);
      }

      // Set default data for other charts
      setTrafficData([
        { name: 'Direct', value: 0, percentage: 0, color: '#3B82F6' },
        { name: 'Search', value: 0, percentage: 0, color: '#10B981' },
        { name: 'Social', value: 0, percentage: 0, color: '#F59E0B' },
        { name: 'Referral', value: 0, percentage: 0, color: '#8B5CF6' },
        { name: 'Email', value: 0, percentage: 0, color: '#EF4444' }
      ]);

      setFunnelData([
        { stage: 'Visitors', count: 0, percentage: 100 },
        { stage: 'Product Views', count: 0, percentage: 0 },
        { stage: 'Add to Cart', count: 0, percentage: 0 },
        { stage: 'Checkout', count: 0, percentage: 0 },
        { stage: 'Purchase', count: orders?.length || 0, percentage: 0 }
      ]);

      setCategoryData([
        { name: 'Dashboards', percentage: 0, revenue: 0, color: '#3B82F6' },
        { name: 'Templates', percentage: 0, revenue: 0, color: '#10B981' },
        { name: 'Plugins', percentage: 0, revenue: 0, color: '#F59E0B' },
        { name: 'Themes', percentage: 0, revenue: 0, color: '#8B5CF6' }
      ]);

      setRecentActivity([]);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    console.log(`Exporting ${type} data...`);
    // Implement export functionality
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Enhanced Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Real-time insights into your store performance and customer behavior
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                  autoRefresh 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{autoRefresh ? 'Live Updates' : 'Manual Refresh'}</span>
                <span className="sm:hidden">{autoRefresh ? 'Live' : 'Manual'}</span>
              </button>
              <button
                onClick={() => handleExport('all')}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Visitors Card */}
          <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Visitors
                  </p>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  12,456
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={14} />
                    <span className="text-sm font-medium">+5.2%</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Conversion Rate Card */}
          <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Conversion Rate
                  </p>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  3.2%
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={14} />
                    <span className="text-sm font-medium">+0.8%</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Average Order Value Card */}
          <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Average Order
                  </p>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  $87.50
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={14} />
                    <span className="text-sm font-medium">+$12.30</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Session Duration Card */}
          <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Session
                  </p>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  3m 24s
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={14} />
                    <span className="text-sm font-medium">+24s</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Time Range Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Time Period</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select date range for analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Activity size={16} className="animate-pulse" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Today', value: 'today' },
              { label: 'Yesterday', value: 'yesterday' },
              { label: 'Last 7 Days', value: 'last7days' },
              { label: 'Last 30 Days', value: 'last30days' },
              { label: 'This Month', value: 'thismonth' },
              { label: 'Custom Range', value: 'custom' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2.5 rounded-xl transition-all duration-200 font-medium flex items-center gap-2 ${
                  timeRange === range.value
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:shadow-md'
                }`}
              >
                {range.label}
                {range.value === 'custom' && <ChevronDown size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue & Sales Chart - Takes 2 columns */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Revenue & Sales Trends
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track performance over time</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Info size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="left" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    fill="url(#revenueGradient)"
                    strokeWidth={3}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    name="Orders"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="products"
                    fill="#F59E0B"
                    name="Products Sold"
                    opacity={0.8}
                    radius={[2, 2, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Traffic Sources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Traffic Sources
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Visitor acquisition</p>
                </div>
              </div>
            </div>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {trafficData.map((source) => (
                <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{source.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {source.percentage}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {source.value.toLocaleString()} visits
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Top Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Top Performing Products
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Best sellers this period</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topProducts.length > 0 ? topProducts.map((product) => (
                  <tr key={product.rank} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm ${
                          product.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                          product.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                          product.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                          'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          {product.rank}
                        </span>
                        {product.rank <= 3 && (
                          <Star className={`w-4 h-4 ${
                            product.rank === 1 ? 'text-yellow-500' :
                            product.rank === 2 ? 'text-gray-400' :
                            'text-orange-500'
                          }`} fill="currentColor" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Digital Product
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.views.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.sales}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(product.revenue)}
                        </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No products data available</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Data will appear once you have sales</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Bottom Grid - Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Conversion Funnel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Conversion Funnel
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer journey</p>
              </div>
            </div>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stage.stage}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(stage.percentage, 5)}%` }}
                    >
                      {stage.percentage > 15 && (
                        <span className="text-xs text-white font-medium">
                          {stage.percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                  {stage.percentage <= 15 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stage.percentage}%
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overall Conversion</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">3.2%</span>
              </div>
            </div>
          </div>

          {/* Enhanced Category Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Category Performance
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue by category</p>
              </div>
            </div>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(category.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(category.percentage, 2)}%`,
                        backgroundColor: category.color 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {category.percentage}% of total revenue
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Real-time Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Live Activity
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time updates</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Users</span>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {realtimeData.activeUsers}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cart Additions</span>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {realtimeData.recentCarts}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Purchases</span>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {realtimeData.recentPurchases}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                Recent Activity
              </p>
              <div className="space-y-2">
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-2 text-xs p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <Icon size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {' '}{activity.action}{' '}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 truncate">
                          {activity.product}
                        </span>
                        <div className="text-gray-500 dark:text-gray-500 mt-1">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-4">
                    <Activity className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Geographic Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sales by Location
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Geographic distribution</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <ExternalLink size={16} />
            </button>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-700 flex items-center justify-center">
            <div className="text-center">
              <Map size={48} className="mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Interactive World Map</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Visualize sales data across different regions
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Hover for details • Click for detailed breakdown
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                Enable Map View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
