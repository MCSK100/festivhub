import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../utils/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import FreeTrialTimer from './FreeTrialTimer'

const NavBar = () => {
  const { user, logout } = useAuth()
  const { darkMode, setDarkMode } = useTheme()

  const handleLogout = () => {
    logout()
  }

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-gray-200/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 h-20 lg:h-28">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-4xl lg:text-5xl font-serif font-light italic bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent hover:scale-110 hover:shadow-sky-500/50 transition-all duration-500 group"
          >
            FestivLink
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
            <FreeTrialTimer />
            
            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 360 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 lg:p-4 rounded-3xl bg-white/80 backdrop-blur-2xl shadow-md border border-gray-200 hover:shadow-lg hover:border-sky-400 hover:bg-sky-50 transition-all duration-500 text-slate-900 hover:text-sky-500"
              >
                {darkMode ? <Sun className="w-6 h-6 lg:w-7 lg:h-7" /> : <Moon className="w-6 h-6 lg:w-7 lg:h-7" />}
              </motion.button>
            </div>

            {/* Auth Buttons */}
            {!user ? (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Link 
                  to="/login"
                  className="px-6 lg:px-8 py-3 lg:py-4 bg-white/90 text-slate-900 rounded-3xl font-light shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-sky-400 hover:shadow-md hover:text-sky-600 transition-all duration-400 backdrop-blur-xl"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  className="bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 px-6 lg:px-8 py-3 lg:py-4 shadow-lg hover:shadow-sky-500/50 text-white rounded-2xl font-medium tracking-wide transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Link 
                  to="/dashboard"
                  className="px-6 lg:px-8 py-3 lg:py-4 bg-white/90 text-slate-800 border border-gray-200 backdrop-blur-xl rounded-3xl font-light shadow-sm hover:bg-sky-50 hover:shadow-md hover:border-sky-400 hover:text-sky-600 transition-all duration-400"
                >
                  Dashboard
                </Link>
                <motion.button 
                  onClick={handleLogout}
                  className="px-6 lg:px-8 py-3 lg:py-4 bg-red-500/90 hover:bg-red-600 text-white rounded-2xl font-medium tracking-wide shadow-lg hover:shadow-red-500/50 transition-all duration-300 backdrop-blur-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="lg:hidden p-3 rounded-3xl bg-white/80 backdrop-blur-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-sky-400 hover:bg-sky-50 transition-all text-slate-900 hover:text-sky-500"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default NavBar
