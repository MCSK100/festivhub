import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Search, LogOut, Calendar, Star } from 'lucide-react'

const CustomerDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const categories = [
    { icon: '📸', name: 'Photography', value: 'photography' },
    { icon: '🍽️', name: 'Catering', value: 'catering' },
    { icon: '🎵', name: 'DJ & Music', value: 'dj' },
    { icon: '✨', name: 'Decorations', value: 'decorations' },
    { icon: '💄', name: 'Makeup & Beauty', value: 'makeup' },
    { icon: '📋', name: 'Event Planning', value: 'planning' },
  ]

  const featuredVendors = [
    {
      id: 1,
      name: 'Elite Wedding Photography',
      category: 'Photography',
      rating: 4.9,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&w=400&fit=crop',
      price: '₹50,000',
      badge: '🏆 Top Rated'
    },
    {
      id: 2,
      name: 'Premium Catering Services',
      category: 'Catering',
      rating: 4.8,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561fd1?ixlib=rb-4.0.3&w=400&fit=crop',
      price: '₹2,000/person',
      badge: '⭐ Verified'
    },
    {
      id: 3,
      name: 'Luxury Event Decoration',
      category: 'Decorations',
      rating: 4.7,
      reviews: 87,
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&w=400&fit=crop',
      price: '₹30,000',
      badge: '✨ Trending'
    },
  ]

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

        {/* Featured Vendors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-serif font-light mb-8 text-slate-900">Featured Vendors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVendors.map((vendor) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                className="glass-accent rounded-2xl overflow-hidden border border-blue-500/30 hover:border-blue-500/60 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl px-3 py-1 rounded-full text-sm font-semibold text-slate-900">
                    {vendor.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{vendor.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{vendor.category}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(vendor.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {vendor.rating} ({vendor.reviews} reviews)
                    </span>
                  </div>

                  {/* Price & Button */}
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-blue-600">{vendor.price}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      View
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default CustomerDashboard
