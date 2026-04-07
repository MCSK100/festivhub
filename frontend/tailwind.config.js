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
          900: '#0B0F19',
          800: '#1E293B',
          700: '#334155',
        },
        gold: {
          500: '#C8A96A',
          400: '#D4B478',
          600: '#A88A52',
        },
        purple: {
          500: '#7C5CFC',
          400: '#A78BFA',
        },
      },
      boxShadow: {
        'gold-glow': '0 0 30px rgba(200,169,106,0.4)',
        'gold-glow-xl': '0 0 80px rgba(200,169,106,0.8)',
        'gold-glow-lg': '0 0 60px rgba(200,169,106,0.6)',
        'purple-glow': '0 0 30px rgba(124,92,252,0.4)',
        'purple-glow-lg': '0 0 60px rgba(124,92,252,0.6)',
        'gold-glow-lg': '0 0 60px rgba(200,169,106,0.6)',
        'navy-glass': '0 8px 32px 0 rgba(11,15,25,0.5)',
        'card-lift': '0 30px 60px -15px rgba(200,169,106,0.15)',
        'hero-glow': '0 25px 50px -12px rgba(11,15,25,0.7), 0 0 40px rgba(200,169,106,0.3)',
        'floating': '0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.05)',
        'neumo-inset': 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.2)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        xl: '20px',
        '2xl': '40px',
        '3xl': '64px',
      },
      backgroundImage: {
        'navy-gold-gradient': 'radial-gradient(circle at 20% 80%, #C8A96A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7C5CFC 0%, transparent 50%)',
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
