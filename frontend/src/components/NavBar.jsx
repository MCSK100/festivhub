import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const NavBar = () => {
  const { user, logout, dashboardPath } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [imgSrc, setImgSrc] = useState('https://i.postimg.cc/6QrBSDmH/festivlivk-logo.png')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const isDashboard = location.pathname.includes('-dashboard')
  const isDarkBg = scrolled || isDashboard
  const isActive = (path) => location.pathname === path

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    ...(user ? [{ href: dashboardPath, label: 'Dashboard', icon: true }] : []),
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isDarkBg
          ? 'bg-[#0a0a12]/85 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-white/85 backdrop-blur-xl border-b border-black/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link to="/" className="hover:scale-105 transition-transform duration-300 flex items-center gap-2">
            <img
              src={imgSrc}
              alt="FestivLink"
              className="h-10 lg:h-12 w-auto"
              onError={() => setImgSrc('/logo.png')}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-all duration-300 pb-1 border-b-2 flex items-center gap-1.5 ${
                  isActive(link.href)
                    ? 'text-yellow-500 border-yellow-500'
                    : isDarkBg
                      ? 'text-white/70 border-transparent hover:text-white hover:border-yellow-500/50'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-yellow-500/50'
                }`}
              >
                {link.icon && <LayoutDashboard className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`px-5 py-2.5 font-medium transition-colors duration-300 text-sm ${
                    isDarkBg ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </Link>
                <Link to="/join" className="btn-primary px-6 py-2.5 text-sm font-semibold flex items-center justify-center !rounded-xl">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <span className={`text-sm font-medium hidden xl:block ${isDarkBg ? 'text-white/60' : 'text-gray-500'}`}>
                  {user.name || user.email}
                </span>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium text-sm transition-all duration-300 border border-red-500/20"
                >
                  Logout
                </motion.button>
              </>
            )}
          </div>

          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${isDarkBg ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className={`flex flex-col gap-2 rounded-xl p-4 mb-4 shadow-lg border ${
                isDarkBg ? 'bg-[#12131f] border-white/10' : 'bg-white border-black/5'
              }`}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-sm font-medium py-2.5 px-3 rounded-lg transition-all duration-300 ${
                      isActive(link.href)
                        ? 'text-yellow-500 bg-yellow-500/10'
                        : isDarkBg
                          ? 'text-white/70 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
                  {!user ? (
                    <>
                      <Link to="/login" className={`px-5 py-2.5 text-center font-medium text-sm ${isDarkBg ? 'text-white/70' : 'text-gray-600'}`}>
                        Sign In
                      </Link>
                      <Link to="/join" className="btn-primary px-5 py-2.5 text-sm font-semibold w-full text-center block !rounded-xl">
                        Get Started
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl font-medium text-sm w-full border border-red-500/20"
                    >
                      Logout ({user.email})
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default NavBar
