import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RoleSelection from './pages/RoleSelection'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VendorDashboard from './pages/VendorDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import PrivateRoute from './components/PrivateRoute'
import { ThemeProvider } from './utils/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import { WhatsAppButton, AIChatBot } from './components/FloatingElements'

// Redirect logged-in users away from auth pages → their dashboard
function PublicOnly({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return children
  if (user) {
    const target = user.role === 'vendor' ? '/vendor-dashboard' : '/customer-dashboard'
    return <Navigate to={target} replace state={{ from: location }} />
  }
  return children
}

function AppShell() {
  const location = useLocation()
  const isDashboard = location.pathname.includes('-dashboard')
  return (
    <div className={`min-h-screen ${isDashboard ? 'bg-[#0a0a12]' : 'bg-white'}`}>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/join" element={<RoleSelection />} />
        <Route path="/role-selection" element={<Navigate to="/join" replace />} />
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
        <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/vendor-dashboard"
          element={
            <PrivateRoute requiredRole="vendor">
              <VendorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            <PrivateRoute requiredRole="customer">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isDashboard && (
        <>
          <WhatsAppButton />
          <AIChatBot />
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <AppShell />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
