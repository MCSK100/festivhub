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
        sans: ['Inter Var', 'Inter', 'ui-sans-serif', 'system-ui'],
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
      },
      colors: {
        navy: {
          900: '#1E3A5F',
          800: '#2D5A8C',
          700: '#3B7DB5',
        },
        gold: {
          500: '#3B82F6',
          400: '#60A5FA',
          600: '#1E40AF',
        },
        purple: {
          500: '#6366F1',
          400: '#818CF8',
        },
      },
      boxShadow: {
        'gold-glow': '0 0 30px rgba(59,130,246,0.3)',
        'gold-glow-xl': '0 0 80px rgba(59,130,246,0.4)',
        'gold-glow-lg': '0 0 60px rgba(59,130,246,0.35)',
        'purple-glow': '0 0 30px rgba(99,102,241,0.3)',
        'purple-glow-lg': '0 0 60px rgba(99,102,241,0.35)',
        'navy-glass': '0 8px 32px 0 rgba(30,58,95,0.1)',
        'card-lift': '0 30px 60px -15px rgba(59,130,246,0.1)',
        'hero-glow': '0 25px 50px -12px rgba(59,130,246,0.15), 0 0 40px rgba(59,130,246,0.2)',
        'floating': '0 20px 40px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.02)',
        'neumo-inset': 'inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(200,200,200,0.2)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        xl: '20px',
        '2xl': '40px',
        '3xl': '64px',
      },
      backgroundImage: {
        'navy-gold-gradient': 'radial-gradient(circle at 20% 80%, #3B82F6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366F1 0%, transparent 50%)',
        'hero-pattern': "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')",
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'gold-pulse': 'goldPulse 2s ease-in-out infinite alternate',
        'blob-float': 'blobFloat 20s ease-in-out infinite',
      },
      keyframes: {
        goldPulse: {
          '0%': { boxShadow: '0 0 20px rgba(200,169,106,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(200,169,106,0.6)' },
        },
        blobFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-30px) rotate(120deg)' },
          '66%': { transform: 'translateY(-15px) rotate(240deg)' },
        },
      }
    },
  },
  plugins: [],
}
