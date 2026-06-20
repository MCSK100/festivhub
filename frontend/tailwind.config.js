/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Inter Var', 'ui-sans-serif', 'system-ui'],
        serif: ['"Playfair Display"', '"Crimson Text"', 'serif'],
        display: ['"Playfair Display"', '"Crimson Text"', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '20': '5rem',
        '22': '5.5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '64': '16rem',
        '96': '24rem',
        '128': '32rem',
      },
      colors: {
        // Premium Dark Background
        premium: {
          bg: '#050505',
          card: '#0F0F0F',
          elevated: '#0A0A0A',
          input: '#141414',
        },
        // Primary Gold (#C59D5F)
        gold: {
          DEFAULT: '#C59D5F',
          light: '#D4AF6A',
          dark: '#A88447',
          accent: '#FFD27D',
        },
        // Semantic
        success: '#4ADE80',
        error: '#F87171',
        warning: '#FBBF24',
        info: '#60A5FA',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(197, 157, 95, 0.3)',
        'glow-lg': '0 0 60px rgba(197, 157, 95, 0.4)',
        'glow-xl': '0 0 80px rgba(197, 157, 95, 0.5)',
        'card': '0 20px 40px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 30px 60px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 0 30px rgba(197, 157, 95, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        xl: '20px',
        '2xl': '40px',
        '3xl': '64px',
      },
      backgroundImage: {
        'premium-gradient': 'radial-gradient(circle at 50% 50%, #0A0A0A 0%, #050505 100%)',
        'gold-shimmer': 'linear-gradient(135deg, transparent 0%, rgba(197, 157, 95, 0.1) 50%, transparent 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee 30s linear infinite reverse',
        'text-reveal': 'textReveal 1s ease-out forwards',
        'parallax': 'parallax 1s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(197, 157, 95, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(197, 157, 95, 0.4)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        textReveal: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        parallax: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50px)' },
        },
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'quart-out': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
    },
  },
  plugins: [],
}