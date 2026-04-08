import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const categories = ['Photography', 'Catering', 'DJ & Music', 'Decorations', 'Makeup & Beauty', 'Event Planning', 'Lighting']

const ProviderDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    experience: 0,
    location: { city: '', state: '' },
    priceRange: '',
    gallery: [],
    bio: ''
  })
  const [uploadPreview, setUploadPreview] = useState([])
  const [analytics, setAnalytics] = useState({ views: 124, leads: 8, bookings: 3 })

  const { fetchUser } = useAuth()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/providers', formData)
      alert('✅ Profile created successfully!')
    } catch (error) {
      console.error(error)
      alert('Error: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const preview = URL.createObjectURL(file)
      setUploadPreview(prev => [...prev, preview])
      // TODO: Real Cloudinary upload
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-28 lg:pt-32 navy-bg backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl lg:text-7xl xl:text-8xl font-serif font-light italic mb-4 bg-gradient-to-r from-gold-400 via-purple-500 to-gold-500 bg-clip-text text-transparent shadow-hero-glow leading-none"
        >
          Professional Dashboard
        </motion.h1>
        <p className="text-2xl lg:text-3xl text-slate-700 mb-20 lg:mb-28 font-light max-w-4xl">
          Showcase your portfolio • Manage bookings • Grow your business
        </p>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-24 lg:mb-32">
          {/* Analytics Cards */}
          <motion.div 
            className="group navy-glass backdrop-blur-3xl p-12 lg:p-16 rounded-[3rem] shadow-2xl hover:shadow-hero-glow hover:-translate-y-4 border border-gold-400/40 hover:border-purple-500/60 transition-all duration-700 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-gold-500 to-purple-500 rounded-[2.5rem] flex items-center justify-center shadow-gold-glow-xl group-hover:rotate-360 transition-all duration-1000">
              <span className="text-2xl font-bold text-slate-900 drop-shadow-lg">👁️</span>
            </div>
            <div className="text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-blue-600 mb-4 shadow-2xl">{analytics.views}</div>
            <p className="text-2xl text-slate-400/90 font-light group-hover:text-slate-300">Profile Views</p>
          </motion.div>

          <motion.div 
            className="group navy-glass backdrop-blur-3xl p-12 lg:p-16 rounded-[3rem] shadow-2xl hover:shadow-hero-glow hover:-translate-y-4 border border-purple-400/40 hover:border-gold-500/60 transition-all duration-700 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-gold-500 rounded-[2.5rem] flex items-center justify-center shadow-purple-glow-xl group-hover:rotate-360 transition-all duration-1000">
              <span className="text-2xl font-bold text-slate-900 drop-shadow-lg">💬</span>
            </div>
            <div className="text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-indigo-600 mb-4 shadow-2xl">{analytics.leads}</div>
            <p className="text-2xl text-slate-400/90 font-light group-hover:text-slate-300">New Inquiries</p>
          </motion.div>

          <motion.div 
            className="group navy-glass backdrop-blur-3xl p-12 lg:p-16 rounded-[3rem] shadow-2xl hover:shadow-hero-glow hover:-translate-y-4 border border-gold-400/40 hover:border-purple-500/60 transition-all duration-700 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-gold-400 to-purple-500 rounded-[2.5rem] flex items-center justify-center shadow-gold-glow-xl group-hover:rotate-360 transition-all duration-1000">
              <span className="text-2xl font-bold text-slate-900 drop-shadow-lg">✅</span>
            </div>
            <div className="text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-blue-600 mb-4 shadow-2xl">{analytics.bookings}</div>
            <p className="text-2xl text-slate-400/90 font-light group-hover:text-slate-300">Confirmed Bookings</p>
          </motion.div>
        </div>

        {/* Profile Form */}
        <motion.section 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="gold-glass backdrop-blur-3xl p-12 lg:p-20 rounded-[4rem] shadow-hero-glow border border-gold-400/40 mb-20 lg:mb-28">
            <h2 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-light italic mb-12 bg-gradient-to-r from-purple-400 via-gold-500 to-purple-500 bg-clip-text text-transparent shadow-purple-glow-lg">
              Complete Your Profile
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-xl font-serif font-light text-slate-800 mb-4">Service Name</label>
                  <input 
                    placeholder="e.g. Elite Wedding Photography" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-6 lg:p-8 rounded-[3rem] border border-purple-400/30 bg-navy-800/50 backdrop-blur-2xl text-xl placeholder-slate-400 font-light focus:ring-4 focus:ring-gold-500/50 focus:border-gold-500/70 transition-all duration-300"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-xl font-serif font-light text-slate-800 mb-4">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-6 lg:p-8 rounded-[3rem] border border-gold-400/30 bg-navy-800/50 backdrop-blur-2xl text-xl font-light focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500/70 transition-all duration-300"
                  >
                    <option value="">Choose specialty</option>
                    {categories.map(cat => <option key={cat}>{cat}</option>)}
                  </select>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <label className="block text-xl font-serif font-light text-slate-800 mb-4">Portfolio Upload</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,video/*"
                  onChange={handleGalleryUpload} 
                  className="w-full file:mr-6 file:py-4 file:px-8 file:rounded-3xl file:border-0 file:text-xl file:font-semibold file:bg-gradient-to-r file:from-gold-500 file:to-purple-500 file:text-slate-900 file:shadow-gold-glow file:cursor-pointer file:transition-all file:hover:shadow-hero-glow file:hover:scale-105 bg-navy-800/50 border border-purple-400/30 rounded-[3rem] p-8 text-xl cursor-pointer transition-all duration-300 hover:border-gold-500/60"
                />
              </motion.div>

              {uploadPreview.length > 0 && (
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {uploadPreview.map((preview, i) => (
                    <motion.img 
                      key={i} 
                      src={preview} 
                      className="w-full h-40 lg:h-48 object-cover rounded-3xl shadow-2xl hover:shadow-hero-glow hover:scale-105 transition-all duration-500 cursor-pointer border-4 border-gold-400/50 hover:border-purple-500/70"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                    />
                  ))}
                </motion.div>
              )}

              <motion.button 
                type="submit"
                className="w-full btn-gold py-10 lg:py-12 text-3xl lg:text-4xl shadow-hero-glow hover:shadow-[0_0_80px_rgba(200,169,106,0.8)] font-serif font-light tracking-wide"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                Launch My Profile
              </motion.button>
            </form>
          </div>
        </motion.section>

        {/* Gallery Preview */}
        <motion.section 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-5xl lg:text-6xl font-serif font-light italic mb-12 bg-gradient-to-r from-gold-400 via-purple-500 to-gold-500 bg-clip-text text-transparent shadow-purple-glow-lg">
            Live Gallery Preview
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Dynamic portfolio grid */}
            {[...Array(8)].map((_, i) => (
              <motion.div 
                key={i}
                className="group navy-glass backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-hero-glow hover:-translate-y-4 border border-gold-400/40 hover:border-purple-500/60 transition-all duration-700 cursor-pointer aspect-video"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-purple-500/20 relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-${i+1}&w=500&fit=crop&auto=format`} 
                    className="w-full h-full object-cover group-hover:brightness-125 transition-all duration-700"
                    alt={`Portfolio ${i + 1}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-xl lg:text-2xl font-serif font-light backdrop-blur-xl px-4 py-2">Portfolio Item #{i + 1}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  )
}

export default ProviderDashboard
