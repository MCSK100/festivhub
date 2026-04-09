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
    <div className="min-h-screen pt-24 lg:pt-28 navy-bg text-slate-900">
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:flex-col w-72 h-full bg-white/80 glass-accent border border-slate-200 shadow-xl backdrop-blur-xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">{vendorProfile?.companyName || vendorProfile?.name || 'VendorHub'}</h1>
            <p className="text-sm text-slate-500 mt-1">Vendor management center</p>
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
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed lg:hidden z-30 w-72 h-full bg-white/80 glass-accent border border-slate-200 shadow-xl flex flex-col backdrop-blur-xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">{vendorProfile?.companyName || vendorProfile?.name || 'VendorHub'}</h1>
          <p className="text-sm text-slate-500 mt-1">Vendor management center</p>
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
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white/90 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <section className="px-6 py-6 lg:px-10 lg:py-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="glass-accent rounded-3xl p-6 border border-slate-200">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Profile Overview</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Review and update your category, experience, company details and contact profile.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="inline-flex items-center justify-center rounded-full border border-blue-500 bg-white px-5 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    Edit Profile Details
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/90 p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Category</p>
                    <p className="mt-2 font-semibold text-slate-900">{vendorProfile?.category || 'Not set'}</p>
                  </div>
                  <div className="rounded-2xl bg-white/90 p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Experience</p>
                    <p className="mt-2 font-semibold text-slate-900">{vendorProfile?.experience || 'Not set'}</p>
                  </div>
                  <div className="rounded-2xl bg-white/90 p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Company</p>
                    <p className="mt-2 font-semibold text-slate-900">{vendorProfile?.companyName || 'Not set'}</p>
                  </div>
                  <div className="rounded-2xl bg-white/90 p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {vendorProfile?.location?.city ? `${vendorProfile.location.city}, ${vendorProfile.location.state}` : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-accent rounded-3xl p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900">Profile Completion</h3>
                <p className="text-sm text-slate-500 mt-1">Keep your profile complete to attract more customers.</p>
                <div className="mt-5 bg-slate-200/70 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, ((vendorProfile?.name?1:0)+(vendorProfile?.companyName?1:0)+(vendorProfile?.description?1:0)+(vendorProfile?.profileImage?1:0)+(vendorProfile?.portfolioImages?.length>0?1:0)+(vendorProfile?.socialLinks?.website||vendorProfile?.socialLinks?.instagram||vendorProfile?.socialLinks?.facebook?1:0))*100/6))}%` }}
                  />
                </div>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <p><strong>Website:</strong> {vendorProfile?.socialLinks?.website || 'Not set'}</p>
                  <p><strong>Instagram:</strong> {vendorProfile?.socialLinks?.instagram || 'Not set'}</p>
                  <p><strong>Facebook:</strong> {vendorProfile?.socialLinks?.facebook || 'Not set'}</p>
                </div>
              </div>
            </div>
          </section>

          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default VendorDashboard
