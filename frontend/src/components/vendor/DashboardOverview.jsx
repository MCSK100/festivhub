import { motion } from 'framer-motion'
import { Calendar, Users, Star, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const DashboardOverview = ({ vendorProfile, bookings, onUpdate }) => {
  // Calculate stats
  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const completedBookings = bookings.filter(b => b.status === 'completed').length

  // Recent bookings (last 5)
  const recentBookings = bookings.slice(0, 5)

  // Profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0
    let total = 6

    if (vendorProfile?.name) completed++
    if (vendorProfile?.companyName) completed++
    if (vendorProfile?.description) completed++
    if (vendorProfile?.profileImage) completed++
    if (vendorProfile?.portfolioImages?.length > 0) completed++
    if (vendorProfile?.socialLinks?.website || vendorProfile?.socialLinks?.instagram || vendorProfile?.socialLinks?.facebook) completed++

    return Math.round((completed / total) * 100)
  }

  const profileCompletion = calculateProfileCompletion()

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Confirmed',
      value: confirmedBookings,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Pending',
      value: pendingBookings,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Completed',
      value: completedBookings,
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {vendorProfile?.name || 'Vendor'}!
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your business today.
        </p>
      </motion.div>

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Profile Completion</h2>
          <span className="text-2xl font-bold text-blue-400">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400">
          Complete your profile to attract more customers and improve your visibility.
        </p>
        {profileCompletion < 100 && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              💡 Tip: Add a profile picture and portfolio images to increase booking chances by 40%!
            </p>
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No bookings yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Start by completing your profile to attract customers!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{booking.customer?.name}</p>
                    <p className="text-sm text-gray-400">{booking.serviceTitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {booking.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                    {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                    {booking.status === 'completed' && <Star className="w-3 h-3" />}
                    {booking.status === 'cancelled' && <AlertCircle className="w-3 h-3" />}
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Tips to Get More Bookings
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">• Complete your profile with photos and description</p>
            <p className="text-sm text-gray-300">• Add portfolio images showcasing your work</p>
            <p className="text-sm text-gray-300">• Respond to booking requests within 24 hours</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-300">• Update your social media links</p>
            <p className="text-sm text-gray-300">• Maintain high ratings and reviews</p>
            <p className="text-sm text-gray-300">• Offer competitive pricing</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardOverview