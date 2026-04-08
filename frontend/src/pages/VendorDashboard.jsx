import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Plus, Calendar, LogOut, AlertCircle } from 'lucide-react'
import api from '../services/api'

const VendorDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    price: '',
    description: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/providers', formData)
      alert('✅ Service added successfully!')
      setFormData({ serviceName: '', category: '', price: '', description: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Error adding service:', error.response?.data || error.message)
      alert('❌ Error: ' + (error.response?.data?.error || error.message))
    }
  }

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
              Vendor Dashboard
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
                You have <span className="font-bold text-blue-600">{trialDaysLeft} days</span> remaining in your trial period.
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-accent rounded-2xl p-8 border border-blue-500/30"
          >
            <div className="text-5xl font-bold text-blue-600 mb-2">{services.length}</div>
            <p className="text-slate-700 font-medium">Services Listed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-accent rounded-2xl p-8 border border-indigo-500/30"
          >
            <div className="text-5xl font-bold text-indigo-600 mb-2">0</div>
            <p className="text-slate-700 font-medium">Bookings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-accent rounded-2xl p-8 border border-green-500/30"
          >
            <div className="text-5xl font-bold text-green-600 mb-2">0</div>
            <p className="text-slate-700 font-medium">Reviews</p>
          </motion.div>
        </div>

        {/* Add Service Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-premium-gold py-4 lg:py-5 text-lg font-semibold flex items-center justify-center gap-2 mb-8"
          >
            <Plus className="w-6 h-6" />
            Add New Service
          </motion.button>

          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleSubmit}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 lg:p-10 border border-blue-200/50 shadow-xl space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    placeholder="e.g., Professional Wedding Photography"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-blue-200/60 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-blue-200/60 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Photography">Photography</option>
                    <option value="Catering">Catering</option>
                    <option value="DJ & Music">DJ & Music</option>
                    <option value="Decorations">Decorations</option>
                    <option value="Makeup & Beauty">Makeup & Beauty</option>
                    <option value="Event Planning">Event Planning</option>
                    <option value="Lighting">Lighting</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Price per Event
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-blue-200/60 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your service, experience, and what makes you stand out..."
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-50 border border-blue-200/60 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  Add Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>

        {/* Services List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-serif font-light mb-8 text-slate-900">Your Services</h2>
          {services.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200/50 rounded-2xl p-12 text-center">
              <p className="text-slate-700 text-lg">No services added yet. Click "Add New Service" to get started!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-accent rounded-2xl p-6 border border-blue-500/30 hover:border-blue-500/60 transition-all"
                >
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.serviceName}</h3>
                  <p className="text-sm text-slate-600 mb-4">{service.category}</p>
                  <p className="text-2xl font-bold text-blue-600">₹{service.price}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default VendorDashboard
