import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Search, LogOut, Calendar, Star, X, Calendar as CalendarIcon, MapPin, Info, AlertTriangle } from 'lucide-react'
import api from '../services/api'
import { useToast } from '../components/ui/Toast'

const CustomerDashboard = () => {
  const { user, logout } = useAuth()
  const { success, error: toastError, info } = useToast()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [vendors, setVendors] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingModal, setBookingModal] = useState({ open: false, vendor: null })
  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null })
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
      toastError('Please select a date in the future')
      return
    }

    setBookingLoading(true)
    try {
      const bookingData = {
        vendorId: bookingModal.vendor._id,
        serviceTitle: bookingModal.vendor.category,
        price: parseInt(bookingModal.vendor.priceRange?.replace(/[^\d]/g, '') || '5000'),
        date: bookingForm.date,
        notes: bookingForm.notes
      }

      await api.post('/bookings', bookingData)
      setBookingModal({ open: false, vendor: null })
      fetchBookings() // Refresh bookings
      success('Booking requested successfully! The vendor will review it shortly.')
    } catch (error) {
      console.error('Error creating booking:', error)
      toastError(error.response?.data?.error || 'Failed to request booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const triggerCancelConfirm = (bookingId) => {
    setCancelModal({ open: true, bookingId })
  }

  const handleCancelBooking = async () => {
    const bookingId = cancelModal.bookingId
    if (!bookingId) return

    try {
      await api.put(`/bookings/${bookingId}/cancel`)
      setCancelModal({ open: false, bookingId: null })
      fetchBookings() // Refresh bookings
      success('Booking cancelled successfully.')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toastError('Failed to cancel booking. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      case 'completed': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
      case 'cancelled': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
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
      className="min-h-screen pt-28 lg:pt-32 navy-bg pb-20 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:justify-between md:items-center gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
              Customer <span className="gradient-gold-text font-semibold">Dashboard</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Welcome back, <span className="text-white font-semibold">{user?.name || user?.email}</span>
            </p>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-rose-600/90 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg self-start md:self-auto"
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
            className="mb-10 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-start gap-4"
          >
            <Calendar className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-1">30-Day Free Trial Active</h3>
              <p className="text-slate-300 text-sm">
                You have <span className="font-bold text-yellow-400">{trialDaysLeft} days left</span> to hire premium event services under trial.
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors by name, category, or location..."
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all shadow-lg text-lg"
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
          <h2 className="text-2xl font-serif font-light mb-6 text-white">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <motion.button
              onClick={() => setSelectedCategory('all')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-2xl font-semibold transition-all text-center border ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 border-transparent shadow-lg shadow-yellow-500/10'
                  : 'bg-white/5 border-white/5 text-white hover:border-indigo-500/30'
              }`}
            >
              <div className="text-2xl mb-2">🎉</div>
              <div className="text-sm">All Services</div>
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-4 rounded-2xl font-semibold transition-all text-center border ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 border-transparent shadow-lg shadow-yellow-500/10'
                    : 'bg-white/5 border-white/5 text-white hover:border-indigo-500/30'
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
          <h2 className="text-2xl font-serif font-light mb-8 text-white">Available Professionals</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVendors.map((vendor) => (
                <motion.div
                  key={vendor._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-accent rounded-3xl overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      <img
                        src={vendor.gallery?.[0] || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&w=400&fit=crop'}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-xl px-3 py-1 rounded-full text-xs font-bold text-yellow-400 border border-white/10">
                        ⭐ {vendor.ratings?.average ? vendor.ratings.average.toFixed(1) : 'New'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white leading-snug">{vendor.name}</h3>
                      </div>
                      <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider mb-3">{vendor.category}</p>
                      
                      {vendor.location?.city && (
                        <p className="text-sm text-slate-300 mb-4 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-indigo-400" />
                          {vendor.location.city}, {vendor.location.state}
                        </p>
                      )}

                      {/* Ratings stars */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(vendor.ratings?.average || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
                          ({vendor.ratings?.count || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Book Button */}
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Estimated Price</p>
                      <p className="text-xl font-extrabold text-white">{vendor.priceRange || 'On Request'}</p>
                    </div>
                    <motion.button
                      onClick={() => handleBookNow(vendor)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && filteredVendors.length === 0 && (
            <div className="text-center py-12 glass-dark rounded-3xl border border-white/10">
              <p className="text-slate-400">No service providers found matching your search.</p>
            </div>
          )}
        </motion.div>

        {/* My Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-serif font-light mb-8 text-white">My Requested Bookings</h2>

          {/* Booking Tabs */}
          <div className="flex gap-2 mb-8">
            {[
              { key: 'all', label: 'All Requests' },
              { key: 'upcoming', label: 'Active & Pending' },
              { key: 'completed', label: 'Completed Orders' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setBookingTab(tab.key)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all border ${
                  bookingTab === tab.key
                    ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/10'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {bookingsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16 glass-dark rounded-3xl border border-white/10">
              <CalendarIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                {bookingTab === 'all' ? 'No bookings scheduled. Browse categories to request event staff!' :
                 bookingTab === 'upcoming' ? 'No active upcoming bookings.' :
                 'No completed event services registered.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="glass-accent rounded-3xl p-6 border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{booking.serviceTitle}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Provider: {booking.vendor?.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-6 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                      <p className="text-sm text-slate-300 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-yellow-500" />
                        {new Date(booking.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-lg font-extrabold text-white">₹{booking.price.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">
                        Submitted: {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {booking.notes && (
                      <p className="text-sm text-slate-300 mb-6 italic bg-white/[0.03] p-3 rounded-xl border border-white/5">
                        "{booking.notes}"
                      </p>
                    )}
                  </div>

                  {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                    <motion.button
                      onClick={() => triggerCancelConfirm(booking._id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full px-4 py-2.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-all shadow-md mt-2"
                    >
                      Cancel Booking Request
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {bookingModal.open && bookingModal.vendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setBookingModal({ open: false, vendor: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f1020] border border-white/10 rounded-3xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-light text-white">Request Service</h2>
                  <p className="text-slate-400 text-sm mt-1">Book {bookingModal.vendor.name}</p>
                </div>
                <button
                  onClick={() => setBookingModal({ open: false, vendor: null })}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Message or Requirements (Optional)
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Describe your event parameters, staging requirements, and timing expectations..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 resize-none text-white"
                  />
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <h3 className="font-bold text-white text-sm mb-2">Summary</h3>
                  <div className="space-y-1 text-sm text-slate-400">
                    <p><strong>Professional:</strong> {bookingModal.vendor.name}</p>
                    <p><strong>Service category:</strong> {bookingModal.vendor.category}</p>
                    <p><strong>Base pricing:</strong> {bookingModal.vendor.priceRange || 'On Request'}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingModal({ open: false, vendor: null })}
                    className="flex-1 px-4 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 rounded-xl font-bold hover:shadow-lg disabled:opacity-50"
                  >
                    {bookingLoading ? 'Requesting...' : 'Request Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setCancelModal({ open: false, bookingId: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f1020] border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cancel Booking Request?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to withdraw this service request? This will inform the service provider.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelModal({ open: false, bookingId: null })}
                  className="flex-1 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors font-semibold"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all font-semibold shadow-lg"
                >
                  Withdraw
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CustomerDashboard
