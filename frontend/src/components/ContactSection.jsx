import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventType: '', message: '' })
  const handleSubmit = (e) => { e.preventDefault(); console.log(formData) }
  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

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
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 lg:p-10">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl" placeholder="your@email.com" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Event Type</label>
                  <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl">
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
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm text-gray-600 mb-2 font-medium">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl resize-none" placeholder="Tell us about your event vision..." />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <span>Schedule Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
