import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true)
  const [accent, setAccent] = useState('gold') // 'gold' | 'purple'

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    // Add accent class for CSS variables
    root.classList.remove('accent-gold', 'accent-purple')
    root.classList.add(`accent-${accent}`)
  }, [darkMode, accent])

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
