import { useState, useEffect } from 'react';
import { Search, Download, FileText, Eye, RefreshCw, Calendar, CreditCard, Package } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store/useStore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

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
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'refunded':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'refunded':
        return '💰';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalSpent = orders.reduce((sum, order) => order.status === 'completed' ? sum + order.total : sum, 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className={`h-8 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 rounded-lg mb-8 w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className={`rounded-2xl p-6 animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className={`h-6 rounded mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 rounded mb-2 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 rounded w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-4xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          My Purchases
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          View and manage your order history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {orders.length}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Orders
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${totalSpent.toFixed(2)}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Spent
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {completedOrders}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Available Downloads
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${
              darkMode 
                ? 'bg-[#1A2C4A] border-white/10 text-white placeholder-gray-400 focus:border-cyan-500' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
            }`}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-3 rounded-xl border-2 outline-none transition-all ${
            darkMode 
              ? 'bg-[#1A2C4A] border-white/10 text-white focus:border-cyan-500' 
              : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
          }`}
        >
          <option value="all">All Orders</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-2xl p-6 border transition-all hover:shadow-lg ${
                darkMode ? 'bg-[#1A2C4A] border-white/10 hover:border-white/20' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getStatusIcon(order.status)}</span>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {order.orderNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.name}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.licenseType} License
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${item.price}
                          </span>
                          {order.status === 'completed' && (
                            <button
                              onClick={() => handleRedownload(item)}
                              className="p-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <div className="text-right mb-4">
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        darkMode 
                          ? 'bg-white/10 text-white hover:bg-white/20' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    
                    {order.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-cyan-500 text-white hover:bg-cyan-600 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-12 rounded-2xl border ${darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'}`}>
            <Package className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No orders found
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery || filterStatus !== 'all' ? 'Try adjusting your filters' : 'You haven\'t made any purchases yet'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Order Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Order Number:</span>
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Date:</span>
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                      {new Date(selectedOrder.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Payment Method:</span>
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Billing Address
                </h4>
                <div className="space-y-1">
                  <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedOrder.billingAddress.name}</p>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{selectedOrder.billingAddress.email}</p>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{selectedOrder.billingAddress.address}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Items Purchased
              </h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className={`p-4 rounded-xl border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </h5>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.licenseType} License
                        </p>
                        <p className={`text-xs font-mono mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          License Key: {item.licenseKey}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${item.price}
                        </p>
                        {selectedOrder.status === 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleRedownload(item)}
                            className="mt-2"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Total: ${selectedOrder.total.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
