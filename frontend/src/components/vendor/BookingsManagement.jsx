import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, User, Mail, Calendar, MessageSquare, AlertCircle } from 'lucide-react'
import api from '../../services/api'
import { useToast } from '../ui/Toast'

const BookingsManagement = ({ bookings, onUpdate }) => {
  const [loading, setLoading] = useState({})
  const { success, error: toastError } = useToast()

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setLoading(prev => ({ ...prev, [bookingId]: true }))
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus })
      const response = await api.get('/bookings/vendor-bookings')
      onUpdate(response.data)
      success(`Booking status updated to ${newStatus} successfully!`)
    } catch (error) {
      console.error('Error updating booking status:', error)
      toastError(error.response?.data?.error || 'Failed to update booking status. Please try again.')
    } finally {
      setLoading(prev => ({ ...prev, [bookingId]: false }))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-700 border-amber-500/25'
      case 'confirmed': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25'
      case 'completed': return 'bg-[#1e4137]/10 text-[#1e4137] border-[#1e4137]/25'
      case 'cancelled': return 'bg-rose-500/10 text-rose-600 border-rose-500/25'
      default: return 'bg-[#0b1311]/5 text-[#0b1311]/60 border-black/10'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1e4137]">Bookings Management</h1>
        <div className="text-sm text-[#0b1311]/60 font-medium">
          {bookings.length} Total Bookings
        </div>
      </div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[var(--jak-border-radius)] p-16 text-center border border-black/5 shadow-sm"
        >
          <Calendar className="w-16 h-16 text-[#0b1311]/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#0b1311] mb-2">No bookings yet</h3>
          <p className="text-[#0b1311]/60 text-sm max-w-sm mx-auto">
            When clients reserve your services, details of the event will show up here.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[var(--jak-border-radius)] p-6 border border-black/5 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Customer Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-12 h-12 bg-[#1e4137]/10 rounded-full flex items-center justify-center border border-[#1e4137]/20">
                        <User className="w-6 h-6 text-[#1e4137]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0b1311]">
                          {booking.customer?.name || 'Client Details'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-[#0b1311]/60 mt-1">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-[#1e4137]" />
                            {booking.customer?.email || 'No email registered'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#0b1311]/[0.03] border border-black/5 rounded-[var(--jak-border-radius)] p-4 mb-4">
                      <div>
                        <p className="text-xs text-[#0b1311]/50 uppercase tracking-wider font-semibold mb-1">Service Type</p>
                        <p className="font-semibold text-[#0b1311]">{booking.serviceTitle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#0b1311]/50 uppercase tracking-wider font-semibold mb-1">Event Date</p>
                        <p className="font-semibold text-[#0b1311] flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#1e4137]" />
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#0b1311]/50 uppercase tracking-wider font-semibold mb-1">Price Offer</p>
                        <p className="font-bold text-emerald-700">₹{booking.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#0b1311]/50 uppercase tracking-wider font-semibold mb-1">Reserved On</p>
                        <p className="font-semibold text-[#0b1311]/70">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="mt-4">
                        <p className="text-xs text-[#0b1311]/50 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-[#1e4137]" />
                          Customer Requirements
                        </p>
                        <p className="text-[#0b1311]/80 bg-[#0b1311]/[0.03] border border-black/5 p-4 rounded-[var(--jak-border-radius)] text-sm italic">
                          "{booking.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="lg:w-64 flex flex-col items-stretch lg:items-end justify-center">
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {booking.status === 'pending' && (
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          disabled={loading[booking._id]}
                          className="flex-1 bg-[#1e4137] hover:bg-[#142e27] text-[#bad6ff] py-2.5 rounded-full font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                        >
                          {loading[booking._id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          disabled={loading[booking._id]}
                          className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-full font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                        >
                          {loading[booking._id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                        disabled={loading[booking._id]}
                        className="w-full bg-[#1e4137] hover:bg-[#142e27] text-[#bad6ff] py-2.5 rounded-full font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                      >
                        {loading[booking._id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Mark Complete
                          </>
                        )}
                      </button>
                    )}

                    {(booking.status === 'completed' || booking.status === 'cancelled') && (
                      <div className="text-center lg:text-right text-[#0b1311]/50 font-medium text-sm py-2">
                        Closed Order
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default BookingsManagement