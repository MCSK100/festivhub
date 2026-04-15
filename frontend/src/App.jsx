import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
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
import { AuthProvider } from './contexts/AuthContext'
import { useToast, ToastContainer } from './components/ui/Toast'

function App() {
  const { toasts, removeToast } = useToast()

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen navy-bg">
            <NavBar />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/role-select" element={<RoleSelection />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
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
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
