// Bookings table access (legacy authenticated flow).
const { getSupabase } = require('../utils/supabase')
const { mapBooking } = require('./map')

async function create(row) {
  const { data, error } = await getSupabase().from('bookings').insert(row).select('*').single()
  if (error) throw error
  return data
}

async function listByCustomer(customerId) {
  const { data, error } = await getSupabase()
    .from('bookings')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

async function listByVendor(vendorId) {
  const { data, error } = await getSupabase()
    .from('bookings')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

async function markVendorRead(vendorId) {
  await getSupabase().from('bookings').update({ is_read: true }).eq('vendor_id', vendorId).eq('is_read', false)
}

async function findById(id) {
  const { data, error } = await getSupabase().from('bookings').select('*').eq('id', id).single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

async function setStatus(id, status) {
  const { data, error } = await getSupabase()
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

module.exports = { create, listByCustomer, listByVendor, markVendorRead, findById, setStatus, mapBooking }
