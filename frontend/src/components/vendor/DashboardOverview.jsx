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
      color: 'text-[#1e4137]',
      bgColor: 'bg-[#1e4137]/10 border border-[#1e4137]/20'
    },
    {
      title: 'Confirmed Offers',
      value: confirmedBookings,
      icon: CheckCircle,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-500/10 border border-emerald-500/20'
    },
    {
      title: 'Pending Requests',
      value: pendingBookings,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10 border border-amber-500/20'
    },
    {
      title: 'Completed Events',
      value: completedBookings,
      icon: Star,
      color: 'text-[#1e4137]',
      bgColor: 'bg-[#bad6ff]/30 border border-[#1e4137]/20'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[var(--jak-border-radius)] p-6 border border-black/5 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-[#0b1311] mb-2 leading-tight">
          Welcome back, <span className="text-[#1e4137]">{vendorProfile?.name || 'Professional'}</span>!
        </h1>
        <p className="text-[#0b1311]/70">
          Here is your business statistics summary for today.
        </p>
      </motion.div>

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[var(--jak-border-radius)] p-6 border border-black/5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0b1311]">Profile Completion Status</h2>
          <span className="text-2xl font-extrabold text-[#1e4137]">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-[#0b1311]/5 rounded-full h-3.5 border border-black/5 overflow-hidden">
          <div
            className="bg-[#1e4137] h-full rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-sm text-[#0b1311]/70 mt-2">
          Complete your profile parameters to rank higher and attract more event planners.
        </p>
        {profileCompletion < 100 && (
          <div className="mt-4 p-3 bg-[#bad6ff]/25 border border-[#1e4137]/20 rounded-[var(--jak-border-radius)]">
            <p className="text-xs text-[#1e4137]">
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
                className="bg-white rounded-[var(--jak-border-radius)] p-6 border border-black/5 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#0b1311]/50 font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
                  <p className="text-3xl font-extrabold text-[#0b1311]">{stat.value}</p>
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
        className="bg-white rounded-[var(--jak-border-radius)] p-6 border border-black/5 shadow-sm"
      >
        <h2 className="text-xl font-bold text-[#0b1311] mb-6">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="w-12 h-12 text-[#0b1311]/30 mx-auto mb-4" />
            <p className="text-[#0b1311]/60 text-sm">No bookings requested yet</p>
            <p className="text-xs text-[#0b1311]/50 mt-1">
              Add details in your Profile tab to become discoverable!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-[#0b1311]/[0.03] border border-black/5 rounded-[var(--jak-border-radius)] hover:border-[#1e4137]/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1e4137]/10 border border-[#1e4137]/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#1e4137]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0b1311] text-sm">{booking.customer?.name || 'Guest User'}</p>
                    <p className="text-xs text-[#0b1311]/60">{booking.serviceTitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#0b1311]/60 font-semibold mb-1">
                    {new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/25' :
                    booking.status === 'pending' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/25' :
                    booking.status === 'completed' ? 'bg-[#1e4137]/10 text-[#1e4137] border border-[#1e4137]/25' :
                    'bg-rose-500/10 text-rose-600 border border-rose-500/25'
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
        className="bg-gradient-to-r from-[#1e4137]/10 via-transparent to-[#bad6ff]/20 rounded-[var(--jak-border-radius)] p-6 border border-[#1e4137]/20"
      >
        <h3 className="text-lg font-bold text-[#1e4137] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Tips to Boost Client Conversions
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-[#0b1311]/70">
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