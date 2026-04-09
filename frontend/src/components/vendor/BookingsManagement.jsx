import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, User, Mail, Calendar, MessageSquare, AlertCircle } from 'lucide-react'
import api from '../../services/api'

const BookingsManagement = ({ bookings, onUpdate }) => {
  const [loading, setLoading] = useState({})

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setLoading(prev => ({ ...prev, [bookingId]: true }))
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus })
      // Refresh bookings
      const response = await api.get('/bookings/vendor-bookings')
      onUpdate(response.data)
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Failed to update booking status. Please try again.')
    } finally {
      setLoading(prev => ({ ...prev, [bookingId]: false }))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
        <h1 className="text-3xl font-bold text-white">Bookings Management</h1>
        <div className="text-sm text-gray-400">
          {bookings.length} total bookings
        </div>
      </div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700"
        >
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
          <p className="text-gray-400">
            When customers book your services, they'll appear here for you to manage.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Customer Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {booking.customer?.name || 'Unknown Customer'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {booking.customer?.email || 'No email'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Service</p>
                      <p className="font-medium text-white">{booking.serviceTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Event Date</p>
                      <p className="font-medium text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Price</p>
                      <p className="font-medium text-green-400">₹{booking.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Booked On</p>
                      <p className="font-medium text-white">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        Customer Notes
                      </p>
                      <p className="text-white bg-gray-700/50 p-3 rounded-lg">
                        "{booking.notes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Status and Actions */}
                <div className="lg:w-64">
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                        disabled={loading[booking._id]}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    <div className="text-center text-gray-400 text-sm">
                      Booking {booking.status}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookingsManagement