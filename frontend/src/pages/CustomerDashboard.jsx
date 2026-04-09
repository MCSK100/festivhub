import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Search, LogOut, Calendar, Star, X, Calendar as CalendarIcon, MapPin, Phone } from 'lucide-react'
import api from '../services/api'

const CustomerDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [vendors, setVendors] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingModal, setBookingModal] = useState({ open: false, vendor: null })
  const [bookingForm, setBookingForm] = useState({
    date: '',
    notes: ''
  })
  const [bookingTab, setBookingTab] = useState('all')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchVendors()
    fetchBookings()
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !query ||
      vendor.name?.toLowerCase().includes(query) ||
      vendor.category?.toLowerCase().includes(query) ||
      vendor.location?.city?.toLowerCase().includes(query) ||
      vendor.location?.state?.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })

  const fetchVendors = async () => {
    try {
      const response = await api.get('/providers')
      setVendors(response.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    setBookingsLoading(true)
    try {
      const response = await api.get('/bookings/my-bookings')
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setBookingsLoading(false)
    }
  }

  const handleBookNow = (vendor) => {
    setBookingModal({ open: true, vendor })
    setBookingForm({ date: '', notes: '' })
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!bookingModal.vendor) return

    // Validate date is in the future
    const selectedDate = new Date(bookingForm.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      alert('Please select a date in the future')
      return
    }

    setBookingLoading(true)
    try {
      const bookingData = {
        vendorId: bookingModal.vendor._id,
        serviceTitle: bookingModal.vendor.category,
        price: parseInt(bookingModal.vendor.priceRange?.replace(/[^\d]/g, '') || '0'),
        date: bookingForm.date,
        notes: bookingForm.notes
      }

      await api.post('/bookings', bookingData)
      setBookingModal({ open: false, vendor: null })
      fetchBookings() // Refresh bookings
      alert('Booking created successfully!')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert(error.response?.data?.error || 'Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      await api.put(`/bookings/${bookingId}/cancel`)
      fetchBookings() // Refresh bookings
      alert('Booking cancelled successfully!')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Failed to cancel booking. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = [
    { icon: '📸', name: 'Photographer', value: 'Photographer' },
    { icon: '🍽️', name: 'Catering', value: 'Catering' },
    { icon: '🎵', name: 'DJ', value: 'DJ' },
    { icon: '✨', name: 'Decorations', value: 'Decorations' },
    { icon: '💐', name: 'Florist', value: 'Florist' },
    { icon: '💡', name: 'Lighting', value: 'Lighting' },
  ]

  const filteredBookings = bookings.filter(booking => {
    if (bookingTab === 'all') return true
    if (bookingTab === 'upcoming') return booking.status === 'pending' || booking.status === 'confirmed'
    if (bookingTab === 'completed') return booking.status === 'completed'
    return true
  })

  const trialDaysLeft = user?.trialExpiration 
    ? Math.ceil((new Date(user.trialExpiration) - new Date()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-28 lg:pt-32 navy-bg backdrop-blur-xl pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-between items-start"
        >
          <div>
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-serif font-light italic mb-4 gradient-gold-text">
              Customer Dashboard
            </h1>
            <p className="text-2xl lg:text-3xl text-slate-700 font-light max-w-4xl">
              Welcome back, <span className="font-semibold text-slate-900">{user?.name || user?.email}</span>
            </p>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-red-500/80 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </motion.div>

        {/* Trial Status */}
        {trialDaysLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-blue-50 border border-blue-200/50 rounded-2xl flex items-start gap-4"
          >
            <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">30-Day Free Trial Active</h3>
              <p className="text-slate-700">
                You have <span className="font-bold text-blue-600">{trialDaysLeft} days</span> remaining to explore premium services.
              </p>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors by name, service, or location..."
              className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-xl border border-blue-200/60 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif font-light mb-6 text-slate-900">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-2xl font-medium transition-all text-center ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white/80 border border-blue-200/50 text-slate-900 hover:border-blue-500/60'
                }`}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="text-sm">{cat.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Browse Vendors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-serif font-light mb-8 text-slate-900">Browse Vendors</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVendors.map((vendor) => (
                <motion.div
                  key={vendor._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className="glass-accent rounded-2xl overflow-hidden border border-blue-500/30 hover:border-blue-500/60 transition-all"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={vendor.gallery?.[0] || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&w=400&fit=crop'}
                      alt={vendor.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl px-3 py-1 rounded-full text-sm font-semibold text-slate-900">
                      ⭐ {vendor.ratings?.average?.toFixed(1) || 'New'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{vendor.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{vendor.category}</p>
                    {vendor.location?.city && (
                      <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {vendor.location.city}, {vendor.location.state}
                      </p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(vendor.ratings?.average || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {vendor.ratings?.average?.toFixed(1) || '0.0'} ({vendor.ratings?.count || 0} reviews)
                      </span>
                    </div>

                    {/* Price & Button */}
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-blue-600">{vendor.priceRange || 'Contact for pricing'}</p>
                      <motion.button
                        onClick={() => handleBookNow(vendor)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No vendors found matching your criteria.</p>
            </div>
          )}
        </motion.div>

        {/* My Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-serif font-light mb-8 text-slate-900">My Bookings</h2>

          {/* Booking Tabs */}
          <div className="flex gap-2 mb-8">
            {[
              { key: 'all', label: 'All Bookings' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'completed', label: 'Completed' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setBookingTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  bookingTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {bookingsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 glass-accent rounded-2xl">
              <CalendarIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">
                {bookingTab === 'all' ? 'No bookings yet. Start by booking a vendor above!' :
                 bookingTab === 'upcoming' ? 'No upcoming bookings.' :
                 'No completed bookings yet.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="glass-accent rounded-2xl p-6 border border-blue-500/30"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{booking.serviceTitle}</h3>
                      <p className="text-sm text-slate-600">{booking.vendor?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-700 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">₹{booking.price.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {booking.notes && (
                    <p className="text-sm text-slate-600 mb-4 italic">"{booking.notes}"</p>
                  )}

                  {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                    <motion.button
                      onClick={() => handleCancelBooking(booking._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-all"
                    >
                      Cancel Booking
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal.open && bookingModal.vendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setBookingModal({ open: false, vendor: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-light text-slate-900">Book Service</h2>
                    <p className="text-slate-600">{bookingModal.vendor.name}</p>
                  </div>
                  <button
                    onClick={() => setBookingModal({ open: false, vendor: null })}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Service Date *
                    </label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      placeholder="Any special requirements or notes..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                    />
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">Booking Summary</h3>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p><strong>Service:</strong> {bookingModal.vendor.category}</p>
                      <p><strong>Price:</strong> {bookingModal.vendor.priceRange}</p>
                      <p><strong>Location:</strong> {bookingModal.vendor.location?.city || 'TBD'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingModal({ open: false, vendor: null })}
                      className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CustomerDashboard
