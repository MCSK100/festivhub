import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const NavBar = () => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const handleLogout = () => logout()

  const isVendorDashboard = location.pathname === '/vendor-dashboard'

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 z-50 w-full glass border-b border-black/5 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="flex justify-between items-center h-20 lg:h-24">
          <Link to="/" className="text-3xl lg:text-4xl font-serif font-light italic gradient-gold hover:scale-110 transition-transform duration-300">
            FestivLink
          </Link>

          {!isVendorDashboard && (
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-all duration-300 pb-2 border-b-2 ${
                    isActive(link.href)
                      ? 'text-primary-dark border-primary'
                      : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-primary/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300 text-sm">
                  Sign In
                </Link>
                <Link to="/role-select" className="btn-primary px-7 py-3 text-sm font-semibold flex items-center justify-center">
                  Get Started
                </Link>
              </>
            ) : (
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium text-sm transition-all duration-300 border border-red-200"
              >
                Logout
              </motion.button>
            )}
          </div>

          {!isVendorDashboard && (
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-gray-200 text-gray-700 hover:text-primary-dark hover:border-primary/50 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          )}
        </div>

        {!isVendorDashboard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? 'auto' : 0 }}
            className="lg:hidden overflow-hidden pb-6"
          >
            <div className="flex flex-col gap-4 bg-white/90 rounded-xl p-4 mt-4 border border-gray-100 shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-primary-dark bg-primary/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-4 mt-4 flex flex-col gap-3">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 text-center text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300 text-sm">
                      Sign In
                    </Link>
                    <Link to="/role-select" onClick={() => setMobileMenuOpen(false)} className="btn-primary px-6 py-3 text-sm font-semibold w-full text-center block">
                      Get Started
                    </Link>
                  </>
                ) : (
                  <motion.button
                    onClick={() => { setMobileMenuOpen(false); handleLogout() }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium text-sm transition-all duration-300 w-full border border-red-200"
                  >
                    Logout
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default NavBar
