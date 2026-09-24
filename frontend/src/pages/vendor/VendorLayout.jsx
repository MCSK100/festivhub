import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState, createContext, useContext } from 'react'
import VendorSidebar from '../../components/vendor/VendorSidebar'
import SEO from '../../components/common/SEO'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

const VendorContext = createContext(null)
export const useVendor = () => useContext(VendorContext)

export function VendorLayout() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [enquiries, setEnquiries] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const [p, e, b] = await Promise.allSettled([
        api.get('/providers/me'),
        api.get('/enquiries/vendor'),
        api.get('/bookings/vendor-bookings'),
      ])
      if (p.status === 'fulfilled') setProfile(p.value.data)
      if (e.status === 'fulfilled') setEnquiries(Array.isArray(e.value.data) ? e.value.data : [])
      if (b.status === 'fulfilled') setBookings(Array.isArray(b.value.data) ? b.value.data : [])
    } catch {
      // keep previous state; individual fetch errors surface in tabs
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate('/vendor/login', { replace: true })
      return
    }
    if (user.role !== 'vendor') {
      navigate('/', { replace: true })
      return
    }
    refresh()
  }, [user, authLoading, navigate, refresh])

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff7f0]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#1e4137]/10 border-t-[#1e4137]" />
          <p className="font-medium text-[#0b1311]/60">Loading your workspace…</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/vendor/login" replace />

  const unread = enquiries.filter((x) => x.status === 'new' || !x.isRead).length
    + bookings.filter((x) => x.status === 'pending').length

  return (
    <VendorContext.Provider value={{ profile, setProfile, enquiries, setEnquiries, bookings, setBookings, refresh }}>
      <div className="min-h-screen bg-[#fff7f0]">
        <SEO title="Vendor Dashboard" description="Manage your FestivLink vendor profile, enquiries and bookings." path="/vendor/dashboard" />
        <VendorSidebar vendorName={profile?.companyName || profile?.name} unread={unread} />
        <main className="min-w-0 flex-1 lg:ml-72">
          <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </VendorContext.Provider>
  )
}
