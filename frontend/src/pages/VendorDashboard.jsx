import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown
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
  const [notificationsOpen, setNotificationsOpen] = useState(false)

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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed lg:relative lg:translate-x-0 z-30 w-64 h-full bg-gray-800 border-r border-gray-700 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400">VendorHub</h1>
          <p className="text-sm text-gray-400 mt-1">Management Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                    {item.id === 'bookings' && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
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
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-700 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold capitalize">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 hover:bg-gray-700 rounded-lg"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                >
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-semibold">Recent Bookings</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="p-3 border-b border-gray-700 hover:bg-gray-700">
                        <p className="text-sm font-medium">{booking.customer?.name}</p>
                        <p className="text-xs text-gray-400">{booking.serviceTitle}</p>
                        <p className="text-xs text-blue-400">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="p-4 text-center text-gray-400">
                        No bookings yet
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default VendorDashboard
