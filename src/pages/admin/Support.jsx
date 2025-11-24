import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ArrowLeft,
  X,
  Paperclip,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Calendar,
  DollarSign,
  Package,
  Key,
  Download,
  RefreshCw,
  Trash2,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  FileText,
  Eye,
  Edit,
  Save,
  Plus,
  Ticket
} from 'lucide-react';
import { toast } from '../../utils/notifications';
import { supabase } from '../../lib/supabase';
import TicketDetailPanel from '../../components/admin/TicketDetailPanel';
import CannedResponses from '../../components/admin/CannedResponses';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);


  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Handle case where table doesn't exist
        if (error.code === '42P01') {
          console.warn('Support tickets table does not exist. Please run the database migration.');
          toast.error('Support system not set up. Please contact administrator.');
          setTickets([]);
          return;
        }
        throw error;
      }

      const transformedTickets = data?.map(ticket => ({
        id: ticket.id,
        subject: ticket.subject || 'No subject',
        customer: {
          name: 'User ' + (ticket.user_id?.slice(-8) || 'Unknown'),
          email: 'user@example.com',
          avatar: null,
          joinDate: ticket.created_at || 'Unknown',
          totalPurchases: 0,
          orderNumber: null
        },
        status: ticket.status || 'open',
        priority: ticket.priority || 'medium',
        category: ticket.category || 'general',
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        description: ticket.description || 'No description'
      })) || [];

      setTickets(transformedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return '🟢';
      case 'in_progress':
        return '🟡';
      case 'closed':
        return '⚫';
      default:
        return '⚪';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailPanel(true);
  };

  const handleUpdateTicket = async (updatedTicket) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          status: updatedTicket.status,
          priority: updatedTicket.priority,
          assigned_to: updatedTicket.assignedTo,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedTicket.id);

      if (error) throw error;

      setTickets(prev => prev.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      ));
      setSelectedTicket(updatedTicket);
      toast.success('Ticket updated successfully');
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error(`Failed to update ticket: ${error.message}`);
    }
  };

  const handleClosePanel = () => {
    setShowDetailPanel(false);
    setSelectedTicket(null);
  };

  const filteredAndSortedTickets = () => {
    let filtered = tickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ticket.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
      const matchesTab = activeTab === 'all' || 
                         (activeTab === 'open' && ticket.status === 'open') ||
                         (activeTab === 'in_progress' && ticket.status === 'in_progress') ||
                         (activeTab === 'closed' && ticket.status === 'closed');
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTab;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'oldest':
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredTickets = filteredAndSortedTickets();

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolvedToday: tickets.filter(t => t.status === 'closed' && 
      new Date(t.updatedAt).toDateString() === new Date().toDateString()).length,
    avgResponseTime: 2.4
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Support Tickets
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage customer support requests and inquiries
        </p>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 shadow-sm border border-green-200 dark:border-green-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2 font-medium">
                <span className="text-xl">🎫</span> Open Tickets
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                {stats.open}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                <ArrowUp size={14} />
                <span className="font-medium">+2 ↑</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 dark:bg-green-800/30 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6 shadow-sm border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2 font-medium">
                <span className="text-xl">⏱️</span> In Progress
              </p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mt-2">
                {stats.inProgress}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                <ArrowDown size={14} />
                <span className="font-medium">-3 ↓</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 dark:bg-yellow-800/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 shadow-sm border border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2 font-medium">
                <span className="text-xl">✅</span> Resolved Today
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                24
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                <ArrowUp size={14} />
                <span className="font-medium">+8 ↑</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 shadow-sm border border-purple-200 dark:border-purple-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2 font-medium">
                <span className="text-xl">⏳</span> Avg Response
              </p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                {stats.avgResponseTime}h
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                <ArrowDown size={14} />
                <span className="font-medium">-0.3h ↓</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {[
            { key: 'all', label: 'All', count: tickets.length },
            { key: 'open', label: 'Open', count: stats.open },
            { key: 'in_progress', label: 'In Progress', count: stats.inProgress },
            { key: 'closed', label: 'Closed', count: tickets.filter(t => t.status === 'closed').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Subject & Customer
              </th>
              <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Loading tickets...
                </td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No tickets found
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md">
                  <td className="px-3 md:px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      #{ticket.id}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {ticket.subject}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ticket.customer.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {ticket.customer.email}
                      </p>
                      {/* Mobile status and priority */}
                      <div className="flex gap-2 mt-2 sm:hidden">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)} {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityIcon(ticket.priority)} {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 md:px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)} {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 md:px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityIcon(ticket.priority)} {ticket.priority}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatTime(ticket.updatedAt)}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <button
                      onClick={() => handleViewTicket(ticket)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Eye size={14} />
                      <span className="hidden sm:inline">View</span>
                      <span className="sm:hidden">→</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Detail Panel */}
      {showDetailPanel && selectedTicket && (
        <TicketDetailPanel
          ticket={selectedTicket}
          onClose={handleClosePanel}
          onUpdate={handleUpdateTicket}
          tickets={tickets}
          setTickets={setTickets}
        />
      )}
    </div>
  );
};

export default Support;
