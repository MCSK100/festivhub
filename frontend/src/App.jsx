import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import PrivateRoute from './components/PrivateRoute'
import { ThemeProvider } from './utils/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/ui/Toast'

// Marketplace (public, NO login)
import Home from './pages/Home'
import Vendors from './pages/Vendors'
import VendorProfilePage from './pages/VendorProfilePage'
import CategoryPage from './pages/CategoryPage'
import BookingPage from './pages/BookingPage'

// Vendor auth (only login in the product)
import VendorLogin from './pages/vendor/VendorLogin'
import VendorRegister from './pages/vendor/VendorRegister'
import { VendorLayout } from './pages/vendor/VendorLayout'
import VendorOverview from './pages/vendor/VendorOverview'
import VendorProfile from './pages/vendor/VendorProfile'
import VendorPortfolio from './pages/vendor/VendorPortfolio'
import VendorServices from './pages/vendor/VendorServices'
import VendorBookings from './pages/vendor/VendorBookings'
import VendorEnquiries from './pages/vendor/VendorEnquiries'
import VendorSettings from './pages/vendor/VendorSettings'

// Legacy pages kept for password recovery only. All other legacy
// customer-auth routes redirect to the new structure below.
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function PublicOnly({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return children
  if (user?.role === 'vendor') {
    return <Navigate to="/vendor/dashboard" replace state={{ from: location }} />
  }
  // Any legacy logged-in customer session lands back on the marketplace:
  // customers need no account, so never keep them on auth pages.
  if (user) return <Navigate to="/" replace state={{ from: location }} />
  return children
}

// Handles "/#section" anchor links (Categories, How It Works): React Router
// doesn't scroll to hashes on its own, so do it here on every navigation.
function ScrollToHash() {
  const { pathname, hash } = useLocation()
  const prevPath = useRef(pathname)
  useEffect(() => {
    if (hash) {
      // Retry briefly — images above the fold can shift layout on load.
      let attempts = 0
      const tryScroll = () => {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (attempts < 10) {
          attempts += 1
          setTimeout(tryScroll, 120)
        }
      }
      // Let the new route render first.
      const t = setTimeout(tryScroll, 60)
      return () => clearTimeout(t)
    }
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      window.scrollTo(0, 0)
    } else {
      prevPath.current = pathname
    }
  }, [pathname, hash])
  return null
}

function AppShell() {
  const location = useLocation()
  const isVendorArea = location.pathname.startsWith('/vendor/')
  // Standalone vendor workspace (dashboard, profile, portfolio, …) brings its
  // own sidebar — the public marketplace header is hidden there. Auth screens
  // (/vendor/login, /vendor/register) keep the public header.
  const isVendorWorkspace =
    isVendorArea && !['/vendor/login', '/vendor/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#fff7f0]">
      {!isVendorWorkspace && <Header />}
      <ScrollToHash />
      <Routes>
        {/* Public marketplace */}
        <Route path="/" element={<Home />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendors/:vendorId" element={<VendorProfilePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/book/:vendorId" element={<BookingPage />} />

        {/* Vendor auth */}
        <Route path="/vendor/login" element={<PublicOnly><VendorLogin /></PublicOnly>} />
        <Route path="/vendor/register" element={<PublicOnly><VendorRegister /></PublicOnly>} />

        {/* Vendor dashboard (protected, vendor role only) */}
        <Route
          path="/vendor"
          element={
            <PrivateRoute requiredRole="vendor">
              <VendorLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<VendorOverview />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="portfolio" element={<VendorPortfolio />} />
          <Route path="services" element={<VendorServices />} />
          <Route path="bookings" element={<VendorBookings />} />
          <Route path="enquiries" element={<VendorEnquiries />} />
          <Route path="settings" element={<VendorSettings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Password recovery (shared, vendor use) */}
        <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Legacy redirects — customer auth is removed */}
        <Route path="/login" element={<Navigate to="/vendor/login" replace />} />
        <Route path="/signup" element={<Navigate to="/vendor/register" replace />} />
        <Route path="/join" element={<Navigate to="/vendor/register" replace />} />
        <Route path="/role-selection" element={<Navigate to="/vendor/register" replace />} />
        <Route path="/vendor-dashboard" element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="/customer-dashboard" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="/faq" element={<Navigate to="/" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isVendorArea && <Footer />}
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Router>
              <AppShell />
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
