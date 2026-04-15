import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Building, Briefcase, FileText, Camera, Facebook, Instagram, Globe, Upload, X, Save } from 'lucide-react'
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
      success('Profile image updated successfully!')
      // Reset file input
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
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <div className="text-sm text-slate-500">
          Profile completion: {profileCompletion}%
        </div>
      </div>

      {/* Profile Completion Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-6 border border-blue-500/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Profile Completion</h2>
          <span className="text-2xl font-bold text-blue-600">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-slate-200/70 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Complete your profile to attract more customers and boost visibility
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl p-6 border border-blue-500/20 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Image</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full overflow-hidden">
                {vendorProfile?.profileImage ? (
                  <img
                    src={vendorProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              {profileImageLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {profileImageLoading ? 'Uploading...' : 'Change Photo'}
              </button>
              <p className="text-xs text-slate-500 mt-2">
                Max file size: 3MB. Recommended: Square image
              </p>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-6 border border-indigo-500/20 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Your company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Catering">Catering</option>
                  <option value="DJ">DJ</option>
                  <option value="Decorations">Decorations</option>
                  <option value="Florist">Florist</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Years of Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g., 5 years"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                placeholder="Tell customers about your services, experience, and what makes you special..."
              />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl p-6 border border-blue-500/20 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Social Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Facebook
              </label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Instagram
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={formData.socialLinks.website}
                  onChange={(e) => handleInputChange('socialLinks.website', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
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
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <div className="text-sm text-slate-500">
          Profile completion: {profileCompletion}%
        </div>
      </div>

      {/* Profile Completion Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-accent rounded-xl p-6 border border-slate-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Profile Completion</h2>
          <span className="text-2xl font-bold text-blue-600">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-slate-200/70 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Complete your profile to attract more customers
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-accent rounded-xl p-6 border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Image</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-slate-200 rounded-full overflow-hidden">
                {vendorProfile?.profileImage ? (
                  <img
                    src={vendorProfile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                )}
              </div>
              {profileImageLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {profileImageLoading ? 'Uploading...' : 'Change Photo'}
              </button>
              <p className="text-xs text-slate-500 mt-2">
                Max file size: 3MB. Recommended: Square image
              </p>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-accent rounded-xl p-6 border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Your company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Catering">Catering</option>
                  <option value="DJ">DJ</option>
                  <option value="Decorations">Decorations</option>
                  <option value="Florist">Florist</option>
                  <option value="Lighting">Lighting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Years of Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g., 5 years"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                placeholder="Tell customers about your services, experience, and what makes you special..."
              />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-accent rounded-xl p-6 border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Social Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Facebook
              </label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Instagram
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={formData.socialLinks.website}
                  onChange={(e) => handleInputChange('socialLinks.website', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
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