import { useState, useEffect } from 'react';
import { Search, Download, FileText, Eye, Package, Calendar, CreditCard, Filter, ChevronDown, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store/useStore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';

export default function PurchasesTab({ darkMode }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { user } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);

  // Sample orders data - replace with API call
  const sampleOrders = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'completed',
      total: 149.99,
      items: [
        {
          id: 1,
          name: 'React Dashboard Pro',
          price: 149.99,
          licenseType: 'Extended',
          downloadUrl: '#',
          licenseKey: 'RDP-2024-XXXX-YYYY'
        }
      ],
      paymentMethod: 'Credit Card',
      billingAddress: {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, City, State 12345'
      }
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      date: '2024-01-10',
      status: 'completed',
      total: 79.99,
      items: [
        {
          id: 2,
          name: 'Vue Admin Template',
          price: 79.99,
          licenseType: 'Regular',
          downloadUrl: '#',
          licenseKey: 'VAT-2024-XXXX-ZZZZ'
        }
      ],
      paymentMethod: 'PayPal',
      billingAddress: {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, City, State 12345'
      }
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      date: '2024-01-05',
      status: 'refunded',
      total: 199.99,
      items: [
        {
          id: 3,
          name: 'Full Stack Starter Kit',
          price: 199.99,
          licenseType: 'Developer',
          downloadUrl: '#',
          licenseKey: 'FSK-2024-XXXX-AAAA'
        }
      ],
      paymentMethod: 'Credit Card',
      billingAddress: {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, City, State 12345'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(sampleOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  const handleDownloadInvoice = (order) => {
    showToast('Invoice download started', 'success');
    // Implement invoice download logic
  };

  const handleRedownload = (item) => {
    showToast(`Downloading ${item.name}...`, 'success');
    // Implement download logic
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'refunded':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'cancelled':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="mr-1.5" />;
      case 'pending':
        return <Clock size={16} className="mr-1.5" />;
      case 'refunded':
        return <AlertCircle size={16} className="mr-1.5" />;
      case 'cancelled':
        return <XCircle size={16} className="mr-1.5" />;
      default:
        return <Package size={16} className="mr-1.5" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const completedOrders = orders.filter(order => order.status === 'completed').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse flex gap-4">
          <div className={`h-32 flex-1 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
          <div className={`h-32 flex-1 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-40 rounded-2xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            My Purchases
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your orders and downloads
          </p>
        </div>
      </div>

      {/* Stats Cards - Removed Total Spent Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative overflow-hidden rounded-3xl p-6 border transition-all hover:shadow-lg ${darkMode
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
              : 'bg-white border-slate-200 shadow-sm'
            }`}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Orders
              </p>
              <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {orders.length}
              </p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
              <Package size={28} />
            </div>
          </div>
          <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'
            }`} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative overflow-hidden rounded-3xl p-6 border transition-all hover:shadow-lg ${darkMode
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
              : 'bg-white border-slate-200 shadow-sm'
            }`}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Downloads
              </p>
              <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {completedOrders}
              </p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'
              }`}>
              <Download size={28} />
            </div>
          </div>
          <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-purple-500' : 'bg-purple-400'
            }`} />
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search by order # or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${darkMode
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full pl-12 pr-10 py-3 rounded-xl border outline-none appearance-none transition-all cursor-pointer ${darkMode
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                }`}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`group rounded-2xl border overflow-hidden transition-all hover:shadow-md ${darkMode
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className={`text-lg font-bold font-mono ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {order.orderNumber}
                        </h3>
                        <span className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
                          <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                            {new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
                          <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                            {order.paymentMethod}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-200 text-slate-500'}`}>
                                <Package size={18} />
                              </div>
                              <div>
                                <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {item.name}
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {item.licenseType} License
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                ${item.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex flex-col sm:flex-row lg:flex-col justify-center gap-3 lg:border-l lg:pl-6 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                      <div className="text-left lg:text-right mb-2 lg:mb-4">
                        <p className={`text-xs uppercase tracking-wider font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Amount</p>
                        <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          ${order.total.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                          className="flex-1 lg:w-full justify-center"
                        >
                          <Eye size={16} className="mr-2" />
                          Details
                        </Button>

                        {order.status === 'completed' && (
                          <Button
                            onClick={() => handleDownloadInvoice(order)}
                            className="flex-1 lg:w-full justify-center bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg shadow-blue-500/20"
                          >
                            <FileText size={16} className="mr-2" />
                            Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-center py-16 rounded-3xl border border-dashed ${darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-800 text-slate-600' : 'bg-white border border-slate-200 text-slate-300'}`}>
                <Package size={40} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                No orders found
              </h3>
              <p className={`max-w-xs mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {searchQuery || filterStatus !== 'all' ? 'Try adjusting your filters to find what you\'re looking for.' : 'You haven\'t made any purchases yet. Start shopping!'}
              </p>
              {!(searchQuery || filterStatus !== 'all') && (
                <Button className="mt-6" onClick={() => window.location.href = '/products'}>
                  Browse Products
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <span className={darkMode ? 'text-white' : 'text-slate-900'}>Order Details</span>
            <span className={`text-sm font-normal px-2 py-0.5 rounded-full border ${selectedOrder ? getStatusColor(selectedOrder.status) : ''}`}>
              {selectedOrder?.orderNumber}
            </span>
          </div>
        }
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-5 rounded-2xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <h4 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  <Calendar size={18} className="text-blue-500" /> Order Info
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Date Placed</span>
                    <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      {new Date(selectedOrder.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Payment Method</span>
                    <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Status</span>
                    <span className={`font-bold ${selectedOrder.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <h4 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  <CreditCard size={18} className="text-purple-500" /> Billing Details
                </h4>
                <div className="space-y-1 text-sm">
                  <p className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.billingAddress.name}</p>
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{selectedOrder.billingAddress.email}</p>
                  <p className={`mt-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedOrder.billingAddress.address}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Purchased Items
              </h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className={`p-4 rounded-2xl border transition-all hover:border-blue-500/30 ${darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <Package size={20} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                        </div>
                        <div>
                          <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {item.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-md ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                              {item.licenseType} License
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          ${item.price}
                        </p>
                        {selectedOrder.status === 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleRedownload(item)}
                            className="h-9"
                          >
                            <Download size={14} className="mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>

                    {item.licenseKey && (
                      <div className={`mt-4 p-3 rounded-xl flex items-center justify-between font-mono text-xs ${darkMode ? 'bg-black/30 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                        <span className="opacity-70">License Key:</span>
                        <span className="font-bold tracking-wider">{item.licenseKey}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`pt-6 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Amount Paid</p>
                  <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    ${selectedOrder.total.toFixed(2)}
                  </p>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  className="w-full sm:w-auto"
                >
                  <FileText size={18} className="mr-2" />
                  Download Invoice PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
