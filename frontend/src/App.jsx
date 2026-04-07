import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ClerkProvider, SignedIn } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RoleSelection from './pages/RoleSelection'
import ProviderDashboard from './pages/ProviderDashboard'
import { ThemeProvider } from './utils/ThemeContext'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  console.error("DEBUG: Clerk Key is missing! Check your .env.local file.")
}
function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <NavBar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
<Route path="/role-select" element={<RoleSelection />} />
<Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <SignedIn>
                    <ProviderDashboard />
                  </SignedIn>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default App
