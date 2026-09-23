// Enquiries table access.
const { getSupabase } = require('../utils/supabase')
const { mapEnquiry, vendorMini } = require('./map')

async function create(row) {
  const { data, error } = await getSupabase().from('enquiries').insert(row).select('*').single()
  if (error) throw error
  return data
}

async function listByVendor(vendorId, status = null) {
  let q = getSupabase().from('enquiries').select('*').eq('vendor_id', vendorId).order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

async function markAllRead(vendorId) {
  await getSupabase().from('enquiries').update({ is_read: true }).eq('vendor_id', vendorId).eq('is_read', false)
}

async function findById(id) {
  const { data, error } = await getSupabase().from('enquiries').select('*').eq('id', id).single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

async function setStatus(id, status) {
  const { data, error } = await getSupabase()
    .from('enquiries')
    .update({ status, is_read: true })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

async function withVendorMini(rows, vendorRow) {
  const mini = vendorRow ? vendorMini(vendorRow) : null
  return (rows || []).map((r) => mapEnquiry(r, mini))
}

module.exports = { create, listByVendor, markAllRead, findById, setStatus, withVendorMini }
