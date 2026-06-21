import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Building, Briefcase, FileText, Camera, Facebook, Instagram, Globe, Save } from 'lucide-react'
import api from '../../services/api'
import { useToast } from '../ui/Toast'

const ProfileSettings = ({ vendorProfile, onUpdate }) => {
  const { success, error } = useToast()
  const [formData, setFormData] = useState({
    name: vendorProfile?.name || '',
    companyName: vendorProfile?.companyName || '',
    category: vendorProfile?.category || '',
    experience: vendorProfile?.experience || '',
    description: vendorProfile?.description || '',
    socialLinks: {
      facebook: vendorProfile?.socialLinks?.facebook || '',
      instagram: vendorProfile?.socialLinks?.instagram || '',
      website: vendorProfile?.socialLinks?.website || ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [profileImageLoading, setProfileImageLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (3MB)
    if (file.size > 3 * 1024 * 1024) {
      error('File size must be less than 3MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      error('Please select an image file')
      return
    }

    setProfileImageLoading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const response = await api.post('/providers/profile-image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      onUpdate(response.data.provider)
      success('Profile photo updated successfully!')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error('Error uploading profile image:', err)
      error(err.response?.data?.error || 'Failed to upload profile image. Please try again.')
    } finally {
      setProfileImageLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      error('Full name is required')
      return
    }
    
    if (!formData.category) {
      error('Please select a category')
      return
    }

    setLoading(true)

    try {
      const response = await api.put('/providers/profile', formData)
      onUpdate(response.data)
      success('Profile updated successfully!')
    } catch (err) {
      console.error('Error updating profile:', err)
      error(err.response?.data?.error || 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const calculateProfileCompletion = () => {
    let completed = 0
    let total = 6

    if (formData.name) completed++
    if (formData.companyName) completed++
    if (formData.description) completed++
    if (vendorProfile?.profileImage) completed++
    if (vendorProfile?.portfolioImages?.length > 0) completed++
    if (formData.socialLinks.website || formData.socialLinks.instagram || formData.socialLinks.facebook) completed++

    return Math.round((completed / total) * 100)
  }

  const profileCompletion = calculateProfileCompletion()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-gold-text">Profile Settings</h1>
        <div className="text-sm text-slate-400 font-medium">
          Completion Rate: {profileCompletion}%
        </div>
      </div>

      {/* Profile Completion Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-500/10 via-purple-500/5 to-indigo-500/10 rounded-3xl p-6 border border-yellow-500/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Profile Progress</h2>
          <span className="text-2xl font-extrabold text-yellow-400">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-3 border border-white/5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Complete your profile parameters to rank higher and attract more event planners.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-accent rounded-3xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-4">Profile Photo</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full overflow-hidden border-2 border-white/10 flex items-center justify-center">
                {vendorProfile?.profileImage ? (
                  <img
                    src={vendorProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-900" />
                )}
              </div>
              {profileImageLoading && (
                <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={profileImageLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
              >
                <Camera className="w-4 h-4" />
                {profileImageLoading ? 'Uploading...' : 'Change Photo'}
              </button>
              <p className="text-xs text-slate-500 mt-2">
                Supported formats: JPG, PNG, WEBP. Max: 3MB.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-accent rounded-3xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-6">Service Profile</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-white placeholder-slate-500 text-sm"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Company name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-white placeholder-slate-500 text-sm"
                  placeholder="e.g. Dream Weddings Co."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Service category *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-white text-sm"
                  required
                >
                  <option value="" disabled className="bg-[#0f1020]">Select Category</option>
                  <option value="Photographer" className="bg-[#0f1020]">Photographer</option>
                  <option value="Catering" className="bg-[#0f1020]">Catering</option>
                  <option value="DJ" className="bg-[#0f1020]">DJ</option>
                  <option value="Decorations" className="bg-[#0f1020]">Decorations</option>
                  <option value="Florist" className="bg-[#0f1020]">Florist</option>
                  <option value="Lighting" className="bg-[#0f1020]">Lighting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Experience Details
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-white placeholder-slate-500 text-sm"
                placeholder="e.g. 5+ years"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Business Bio / Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-white placeholder-slate-500 text-sm resize-none"
                placeholder="Describe your service catalog, catering details, or photography package options..."
              />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-accent rounded-3xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-6">Social Portals</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Facebook Link
              </label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-white placeholder-slate-500 text-sm"
                  placeholder="https://facebook.com/page"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Instagram Link
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-white placeholder-slate-500 text-sm"
                  placeholder="https://instagram.com/handle"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Personal / Business Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="url"
                  value={formData.socialLinks.website}
                  onChange={(e) => handleInputChange('socialLinks.website', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-white placeholder-slate-500 text-sm"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-950"></div>
                Saving Profile...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}

export default ProfileSettings