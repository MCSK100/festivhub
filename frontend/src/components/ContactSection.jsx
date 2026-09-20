import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventType: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const next = {}
    if (!formData.name.trim()) next.name = 'Name is required.'
    if (!/\S+@\S+\.\S+/.test(formData.email.trim())) next.email = 'Enter a valid email.'
    if (formData.phone.trim() && !/^[+\d][\d\s\-()]{6,}$/.test(formData.phone.trim())) {
      next.phone = 'Enter a valid phone number.'
    }
    if (!formData.eventType) next.eventType = 'Select an event type.'
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      next.message = 'Tell us a little more (min 10 characters).'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    if (!validate()) {
      setStatus({ type: 'error', message: 'Please fix the highlighted fields.' })
      return
    }
    setSubmitting(true)
    // No backend endpoint yet — simulate async submit so UX is testable
    setTimeout(() => {
      setSubmitting(false)
      setStatus({ type: 'success', message: `Thanks ${formData.name.trim()}! We'll reach out at ${formData.email.trim()} within 24 hours.` })
      setFormData({ name: '', email: '', phone: '', eventType: '', message: '' })
    }, 800)
  }

  const fieldClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl ${hasError ? 'border-red-400 !border-red-400' : ''}`

  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <motion.span variants={itemVariants} className="inline-block text-primary-dark text-sm font-medium uppercase tracking-widest mb-4">Contact Us</motion.span>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-display font-light mb-6 text-gray-900">
              Ready to Create Something <span className="gradient-gold">Extraordinary?</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-500 mb-10 leading-relaxed">
              Let's bring your vision to life. Schedule your free consultation today and discover how FestivLink can transform your next event into an unforgettable experience.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-6 mb-10">
              {[
                { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                { icon: Mail, label: 'Email', value: 'hello@festivlink.com' },
                { icon: MapPin, label: 'Location', value: 'New York • Global' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary-dark">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-gray-900 font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 lg:p-10" noValidate>
              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                      status.type === 'success'
                        ? 'bg-green-50 border border-green-300 text-green-700'
                        : 'bg-red-50 border border-red-300 text-red-600'
                    }`}
                    role={status.type === 'success' ? 'status' : 'alert'}
                  >
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={fieldClass(errors.name)} placeholder="Your name" />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClass(errors.email)} placeholder="your@email.com" />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={fieldClass(errors.phone)} placeholder="+1 (555) 000-0000" />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Event Type *</label>
                  <select name="eventType" value={formData.eventType} onChange={handleChange} className={fieldClass(errors.eventType)}>
                    <option value="">Select event type</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="brand">Brand Activation</option>
                    <option value="exhibition">Exhibition</option>
                    <option value="product-launch">Product Launch</option>
                    <option value="concert">Concert</option>
                    <option value="festival">Festival</option>
                    <option value="conference">Conference</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.eventType && <p className="text-xs text-red-600 mt-1">{errors.eventType}</p>}
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm text-gray-600 mb-2 font-medium">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className={`${fieldClass(errors.message)} resize-none`} placeholder="Tell us about your event vision..." />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                <span>{submitting ? 'Sending…' : 'Schedule Consultation'}</span>
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
