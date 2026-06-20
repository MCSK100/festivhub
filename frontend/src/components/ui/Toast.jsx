import React, { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const newToast = { id, message, type }
    
    setToasts(prev => [...prev, newToast])
    
    if (duration) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (message, duration = 3000) => addToast(message, 'success', duration)
  const error = (message, duration = 5000) => addToast(message, 'error', duration)
  const info = (message, duration = 3000) => addToast(message, 'info', duration)
  const warning = (message, duration = 4000) => addToast(message, 'warning', duration)

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-[9999] space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

const ToastItem = ({ toast, onClose }) => {
  const bgColor = {
    success: 'bg-emerald-600/95 backdrop-blur-md border border-emerald-500/30',
    error: 'bg-rose-600/95 backdrop-blur-md border border-rose-500/30',
    info: 'bg-indigo-600/95 backdrop-blur-md border border-indigo-500/30',
    warning: 'bg-amber-600/95 backdrop-blur-md border border-amber-500/30'
  }[toast.type]

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle
  }[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      layout
      className={`${bgColor} text-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-start gap-3 pointer-events-auto max-w-sm`}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export const ToastContainer = ({ toasts, removeToast }) => (
  <Toast toasts={toasts} removeToast={removeToast} />
)

export default Toast
