import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Sticky CTA
export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={() => navigate('/contact')}
            className="btn-primary flex items-center gap-2 shadow-lg"
          >
            <span>Plan Your Event</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// WhatsApp Button
export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const openWhatsApp = () => {
    window.open('https://wa.me/15551234567', '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass-card rounded-2xl p-4 mb-4 w-64"
          >
            <p className="text-white text-sm mb-3">
              Hi! How can we help you plan your event?
            </p>
            <button
              onClick={openWhatsApp}
              className="w-full btn-primary text-sm py-2"
            >
              Start Chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  )
}

// AI Chat Bot
export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI Event Assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')

    // Simulated response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Thank you for your interest! Our team would be happy to discuss your event needs. Would you like to schedule a consultation?'
      }])
    }, 1000)
  }

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass-card rounded-2xl w-80 h-96 mb-4 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-white">AI Event Assistant</h3>
              <p className="text-xs text-gray-400">Ask us anything</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm p-3 rounded-xl ${
                    msg.role === 'assistant'
                      ? 'bg-gold/10 text-gray-300'
                      : 'bg-gold text-white'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-lg bg-premium-input text-sm"
                />
                <button
                  onClick={handleSend}
                  className="p-2 rounded-lg bg-gold text-premium-bg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-lg"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-premium-bg" />
        ) : (
          <span className="text-xl">🤖</span>
        )}
      </motion.button>
    </div>
  )
}