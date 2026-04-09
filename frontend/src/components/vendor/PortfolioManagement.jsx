import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Trash2, Plus } from 'lucide-react'
import api from '../../services/api'

const PortfolioManagement = ({ vendorProfile, onUpdate }) => {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState({})
  const fileInputRef = useRef(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert('File size must be less than 3MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await api.post(`/providers/${vendorProfile._id}/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      onUpdate({ ...vendorProfile, portfolioImages: [...(vendorProfile.portfolioImages || []), response.data.url] })
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageUrl) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    setDeleting(prev => ({ ...prev, [imageUrl]: true }))
    try {
      await api.delete(`/providers/portfolio/${encodeURIComponent(imageUrl)}`)
      onUpdate({
        ...vendorProfile,
        portfolioImages: vendorProfile.portfolioImages.filter(img => img !== imageUrl)
      })
      alert('Image deleted successfully!')
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image. Please try again.')
    } finally {
      setDeleting(prev => ({ ...prev, [imageUrl]: false }))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Portfolio Management</h1>
        <div className="text-sm text-gray-400">
          {vendorProfile?.portfolioImages?.length || 0} images
        </div>
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Add Portfolio Images</h3>
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">Upload Portfolio Images</h4>
              <p className="text-gray-400 mb-4">
                Show your best work to attract more customers
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Choose Images
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Max file size: 3MB per image. Supported formats: JPG, PNG, GIF
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Portfolio Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Your Portfolio</h3>

        {!vendorProfile?.portfolioImages || vendorProfile.portfolioImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">No portfolio images yet</h4>
            <p className="text-gray-400 mb-6">
              Upload images of your work to showcase your services to potential customers.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorProfile.portfolioImages.map((imageUrl, index) => (
              <motion.div
                key={imageUrl}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group bg-gray-700 rounded-lg overflow-hidden"
              >
                <div className="aspect-square">
                  <img
                    src={imageUrl}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDeleteImage(imageUrl)}
                    disabled={deleting[imageUrl]}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting[imageUrl] ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Delete button (always visible on mobile) */}
                <button
                  onClick={() => handleDeleteImage(imageUrl)}
                  disabled={deleting[imageUrl]}
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed lg:opacity-0 lg:group-hover:opacity-100"
                >
                  {deleting[imageUrl] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Tips</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">• Upload high-quality images of your work</p>
            <p className="text-sm text-gray-300">• Include variety in your portfolio</p>
            <p className="text-sm text-gray-300">• Show before/after shots when possible</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-300">• Keep images under 3MB for fast loading</p>
            <p className="text-sm text-gray-300">• Use natural lighting in photos</p>
            <p className="text-sm text-gray-300">• Update portfolio regularly</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PortfolioManagement