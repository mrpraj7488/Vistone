import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  Paperclip,
  Send,
  Package,
  User,
  Key,
  Download,
  DollarSign,
  Trash2,
  Save,
  MessageSquare,
  FileText,
  Clock,
  Calendar,
  Zap
} from 'lucide-react';
import { toast } from '../../utils/notifications';
import CannedResponses from './CannedResponses';

const TicketDetailPanel = ({ ticket, onClose, onUpdate, tickets, setTickets }) => {
  const [replyText, setReplyText] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [showInternalNote, setShowInternalNote] = useState(false);
  const [closeAfterSend, setCloseAfterSend] = useState(false);
  const [sendCopy, setSendCopy] = useState(false);
  const [showCannedResponses, setShowCannedResponses] = useState(false);

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: 'Support',
      type: 'support',
      message: replyText,
      timestamp: new Date()
    };

    const updatedTicket = {
      ...ticket,
      messages: [...(ticket.messages || []), newMessage],
      updatedAt: new Date()
    };

    onUpdate(updatedTicket);
    toast.success('Reply sent successfully');
    setReplyText('');

    if (closeAfterSend) {
      handleCloseTicket();
    }
  };

  const handleAddInternalNote = () => {
    if (!internalNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    const newNote = {
      id: Date.now(),
      author: 'Admin',
      note: internalNote,
      timestamp: new Date()
    };

    const updatedTicket = {
      ...ticket,
      internalNotes: [...(ticket.internalNotes || []), newNote]
    };

    onUpdate(updatedTicket);
    toast.success('Internal note added');
    setInternalNote('');
    setShowInternalNote(false);
  };

  const handleCloseTicket = () => {
    const updatedTicket = {
      ...ticket,
      status: 'closed',
      updatedAt: new Date()
    };
    onUpdate(updatedTicket);
    toast.success('Ticket closed');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'view_order':
        toast.info(`Viewing order #${ticket.orderId || 'N/A'}`);
        break;
      case 'view_customer':
        toast.info(`Viewing customer profile: ${ticket.customer.name}`);
        break;
      case 'regenerate_license':
        toast.success('License regenerated and sent to customer');
        break;
      case 'resend_download':
        toast.success('Download link resent to customer');
        break;
      case 'process_refund':
        toast.success('Refund process initiated');
        break;
      case 'delete_ticket':
        if (window.confirm('Are you sure you want to delete this ticket?')) {
          setTickets(prev => prev.filter(t => t.id !== ticket.id));
          onClose();
          toast.success('Ticket deleted');
        }
        break;
      default:
        toast.info(`Action: ${action}`);
    }
  };

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const insertCannedResponse = (response) => {
    setReplyText(response.text);
    setShowCannedResponses(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 animate-fadeIn">
      <div className="w-full lg:max-w-5xl md:max-w-3xl bg-white dark:bg-gray-800 h-full flex flex-col lg:flex-row shadow-2xl transform transition-transform duration-300 ease-out animate-slideInRight">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Panel Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  Ticket #{ticket.id}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  {ticket.category} • {formatTimestamp(ticket.updatedAt)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* Subject */}
            <div className="mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                {ticket.subject}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.status === 'open' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : ticket.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {ticket.status === 'open' ? '🟢' : ticket.status === 'in_progress' ? '🟡' : '⚫'} {ticket.status.replace('_', ' ')}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.priority === 'high'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    : ticket.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {ticket.priority === 'high' ? '🔴' : ticket.priority === 'medium' ? '🟡' : '🔵'} {ticket.priority}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {ticket.customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {ticket.customer.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ticket.customer.email}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Since {new Date(ticket.customer.joinDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package size={12} />
                      {ticket.customer.totalPurchases} purchases
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={12} />
                      ${ticket.customer.totalSpent} spent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={ticket.status}
                  onChange={(e) => onUpdate({ ...ticket, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) => onUpdate({ ...ticket, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned to
                </label>
                <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                  <option>Select Staff</option>
                  <option>Support Agent 1</option>
                  <option>Support Agent 2</option>
                  <option>Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="licensing">Licensing</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            {/* Conversation History */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-500" />
                Conversation History
              </h4>
              <div className="space-y-4">
                {ticket.messages && ticket.messages.length > 0 ? ticket.messages.map((message) => (
                  <div key={message.id} className={`rounded-xl p-4 border ${
                    message.type === 'customer' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                        message.type === 'customer'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-gradient-to-br from-green-500 to-green-600'
                      }`}>
                        {message.sender.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {message.sender}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            message.type === 'customer'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300'
                          }`}>
                            {message.type === 'customer' ? 'Customer' : 'Support'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                          {message.message}
                        </p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.attachments.map((attachment, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                                <Paperclip size={12} />
                                {attachment}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No messages yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Internal Notes */}
            {ticket.internalNotes && ticket.internalNotes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-yellow-500" />
                  Internal Notes
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
                    Staff Only
                  </span>
                </h4>
                <div className="space-y-3">
                  {ticket.internalNotes.map((note) => (
                    <div key={note.id} className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                          {note.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                            {note.note}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <User size={10} />
                            {note.author} • {formatTimestamp(note.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Section */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Send size={20} className="text-green-500" />
                Reply to Customer
              </h4>
              
              {/* Canned Responses Button */}
              <div className="mb-4">
                <button
                  onClick={() => setShowCannedResponses(!showCannedResponses)}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <FileText size={16} />
                  Insert Canned Response
                </button>
              </div>

              {showCannedResponses && (
                <div className="mb-4">
                  <CannedResponses onInsert={insertCannedResponse} />
                </div>
              )}

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                rows={6}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none"
              />

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-4 gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Paperclip size={16} />
                    Attach Files
                  </button>
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={closeAfterSend}
                      onChange={(e) => setCloseAfterSend(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    Close ticket after sending
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={sendCopy}
                      onChange={(e) => setSendCopy(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    Send copy to my email
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowInternalNote(!showInternalNote)}
                    className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-lg transition-colors font-medium"
                  >
                    Add Internal Note
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium">
                    Save as Draft
                  </button>
                  <button
                    onClick={handleSendReply}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                  >
                    <Send size={16} />
                    Send Reply
                  </button>
                </div>
              </div>

              {/* Internal Note Input */}
              {showInternalNote && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
                  <h5 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    Add Internal Note
                  </h5>
                  <textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Add an internal note (visible only to staff)..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => {
                        setShowInternalNote(false);
                        setInternalNote('');
                      }}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddInternalNote}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="hidden lg:block w-72 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-l border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              {ticket.orderId && (
                <button
                  onClick={() => handleQuickAction('view_order')}
                  className="w-full px-4 py-3 text-left text-sm bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Package size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">View Order</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">#{ticket.orderId}</p>
                  </div>
                </button>
              )}
              <button
                onClick={() => handleQuickAction('view_customer')}
                className="w-full px-4 py-3 text-left text-sm bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View Customer</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Profile & History</p>
                </div>
              </button>
              <button
                onClick={() => handleQuickAction('regenerate_license')}
                className="w-full px-4 py-3 text-left text-sm bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Key size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Regenerate License</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">New license key</p>
                </div>
              </button>
              <button
                onClick={() => handleQuickAction('resend_download')}
                className="w-full px-4 py-3 text-left text-sm bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Download size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Resend Download</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fresh download link</p>
                </div>
              </button>
              <button
                onClick={() => handleQuickAction('process_refund')}
                className="w-full px-4 py-3 text-left text-sm bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign size={16} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Process Refund</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Initiate refund</p>
                </div>
              </button>
              
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
              
              <button
                onClick={() => handleQuickAction('delete_ticket')}
                className="w-full px-4 py-3 text-left text-sm bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-red-700 dark:text-red-300">Delete Ticket</p>
                  <p className="text-xs text-red-500 dark:text-red-400">Permanent removal</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPanel;
