import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import api from '../services/api'

// Sub-components
import DashboardOverview from '../components/vendor/DashboardOverview'
import BookingsManagement from '../components/vendor/BookingsManagement'
import ProfileSettings from '../components/vendor/ProfileSettings'
import PortfolioManagement from '../components/vendor/PortfolioManagement'

const VendorDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [vendorProfile, setVendorProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'vendor') {
      navigate('/customer-dashboard')
      return
    }
    fetchVendorData()
  }, [user, navigate])

  const fetchVendorData = async () => {
    try {
      setLoading(true)
      const [profileRes, bookingsRes] = await Promise.all([
        api.get('/providers/me'),
        api.get('/bookings/vendor-bookings')
      ])
      
      setVendorProfile(profileRes.data)
      setBookings(bookingsRes.data)
      setUnreadCount(bookingsRes.data.filter(b => !b.isRead).length)
    } catch (error) {
      console.error('Error fetching vendor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const updateVendorProfile = (updatedProfile) => {
    setVendorProfile(updatedProfile)
  }

  const updateBookings = (updatedBookings) => {
    setBookings(updatedBookings)
    setUnreadCount(updatedBookings.filter(b => !b.isRead).length)
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'services', label: 'My Services', icon: Briefcase },
    { id: 'profile', label: 'Profile Settings', icon: Settings }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            vendorProfile={vendorProfile}
            bookings={bookings}
            onUpdate={fetchVendorData}
          />
        )
      case 'bookings':
        return (
          <BookingsManagement
            bookings={bookings}
            onUpdate={updateBookings}
          />
        )
      case 'services':
        return (
          <PortfolioManagement
            vendorProfile={vendorProfile}
            onUpdate={updateVendorProfile}
          />
        )
      case 'profile':
        return (
          <ProfileSettings
            vendorProfile={vendorProfile}
            onUpdate={updateVendorProfile}
          />
        )
      default:
        return (
          <DashboardOverview
            vendorProfile={vendorProfile}
            bookings={bookings}
            onUpdate={fetchVendorData}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center navy-bg">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 border-2 border-white/10 border-t-yellow-400 rounded-full mx-auto mb-4"
          />
          <p className="text-slate-400 font-medium">Loading your workspace…</p>
        </div>
      </div>
    )
  }

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-lg">
            {(vendorProfile?.name || 'V').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight truncate max-w-[160px]">
              {vendorProfile?.companyName || vendorProfile?.name || 'FestivLink Vendor'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Vendor Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 text-yellow-400 border border-yellow-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-400' : ''}`} />
                  {item.label}
                  {item.id === 'bookings' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen pt-24 lg:pt-28 navy-bg">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col fixed top-24 left-0 w-72 h-[calc(100vh-6rem)] glass-dark border-r border-white/10 z-20">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed top-0 left-0 w-72 h-full glass-dark border-r border-white/10 z-40 flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <span className="text-white font-bold text-sm">Menu</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden glass-dark border-b border-white/10 px-5 py-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl glass-accent border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-6 lg:p-8 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

export default VendorDashboard
