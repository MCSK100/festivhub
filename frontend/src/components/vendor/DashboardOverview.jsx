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
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border border-indigo-500/20'
    },
    {
      title: 'Confirmed Offers',
      value: confirmedBookings,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border border-emerald-500/20'
    },
    {
      title: 'Pending Requests',
      value: pendingBookings,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border border-amber-500/20'
    },
    {
      title: 'Completed Events',
      value: completedBookings,
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 border border-yellow-500/20'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-accent rounded-3xl p-6 border border-white/10"
      >
        <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
          Welcome back, <span className="gradient-gold-text font-serif italic font-light">{vendorProfile?.name || 'Professional'}</span>!
        </h1>
        <p className="text-slate-300">
          Here is your business statistics summary for today.
        </p>
      </motion.div>

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-accent rounded-3xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Profile Completion Status</h2>
          <span className="text-2xl font-extrabold text-yellow-400">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-3.5 border border-white/5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-300 mt-2">
          Complete your profile parameters to rank higher and attract more event planners.
        </p>
        {profileCompletion < 100 && (
          <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <p className="text-xs text-indigo-300">
              💡 Tip: Uploading gallery photos and listing location coordinates increases client conversions by 45%!
            </p>
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-accent rounded-3xl p-6 border border-white/10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
                  <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                </div>
                <div className={`p-3.5 rounded-2xl ${stat.bgColor}`}>
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
        className="glass-dark rounded-3xl p-6 border border-white/10"
      >
        <h2 className="text-xl font-bold text-white mb-6">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">No bookings requested yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Add details in your Profile tab to become discoverable!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{booking.customer?.name || 'Guest User'}</p>
                    <p className="text-xs text-slate-400">{booking.serviceTitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-semibold mb-1">
                    {new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                    booking.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                    booking.status === 'completed' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                  }`}>
                    {booking.status}
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
        className="bg-gradient-to-r from-yellow-500/10 via-purple-500/5 to-indigo-500/10 rounded-3xl p-6 border border-yellow-500/20"
      >
        <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Tips to Boost Client Conversions
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="space-y-2">
            <p>• Elaborate your services offering in detail inside Settings.</p>
            <p>• Upload high-definition pictures displaying decorations or camera gear.</p>
            <p>• Respond to pending service offers within 24 hours.</p>
          </div>
          <div className="space-y-2">
            <p>• Provide social media profiles to establish trust with buyers.</p>
            <p>• Maintain clear service pricing parameters.</p>
            <p>• Deliver high-quality work to secure 5-star ratings.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardOverview