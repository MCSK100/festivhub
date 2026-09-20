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
  const { user, logout, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [vendorProfile, setVendorProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    if (user.role !== 'vendor') {
      navigate('/customer-dashboard', { replace: true })
      return
    }
    fetchVendorData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role, authLoading])

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
    navigate('/login', { replace: true })
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
      <div className="min-h-screen flex items-center justify-center bg-[#fff7f0] pt-20">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 border-2 border-[#1e4137]/10 border-t-[#1e4137] rounded-full mx-auto mb-4"
          />
          <p className="text-[#0b1311]/60 font-medium">Loading your workspace…</p>
        </div>
      </div>
    )
  }

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#bad6ff] flex items-center justify-center text-[#1e4137] font-bold text-lg">
            {(vendorProfile?.name || 'V').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-bold text-[#fff7f0] leading-tight truncate max-w-[160px]">
              {vendorProfile?.companyName || vendorProfile?.name || 'FestivLink Vendor'}
            </h1>
            <p className="text-xs text-[#fff7f0]/60 mt-0.5">Vendor Portal</p>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-[#bad6ff] text-[#1e4137]'
                      : 'text-[#fff7f0]/70 hover:bg-white/10 hover:text-[#fff7f0]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {item.id === 'bookings' && unreadCount > 0 && (
                    <span className="ml-auto bg-[#ff643c] text-white text-xs px-2 py-0.5 rounded-full font-bold">
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
          className="w-full flex items-center gap-3 px-4 py-3 text-[#fff7f0]/70 hover:bg-white/10 hover:text-[#fff7f0] rounded-full transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen pt-16 lg:pt-20 bg-[#fff7f0]">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col fixed top-16 lg:top-20 left-0 w-72 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] bg-[#1e4137] z-20">
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
                className="fixed top-0 left-0 w-72 h-full bg-[#1e4137] z-40 flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <span className="text-[#fff7f0] font-bold text-sm">Menu</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-[#fff7f0]/70 hover:text-[#fff7f0] transition-colors"
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
          <div className="lg:hidden bg-white border-b border-black/5 px-5 py-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0b1311]">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-full bg-[#1e4137] text-[#bad6ff] transition-colors"
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
