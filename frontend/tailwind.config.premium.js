/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Color Palette
        primary: '#C59D5F',
        secondary: '#FFFFFF',
        accent: '#FFD27D',
        background: '#050505',
        
        // Gold Palette
        gold: {
          50: '#FFFBF0',
          100: '#FEF3E2',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // Dark Palette
        dark: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#050505',
        },
      },

      fontFamily: {
        serif: ["'Playfair Display'", 'serif'],
        sans: ["'Inter'", 'sans-serif'],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.2' }],
        '7xl': ['4.5rem', { lineHeight: '1.2' }],
      },

      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },

      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
      },

      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        
        // Luxury shadows
        luxury: '0 20px 40px rgba(197, 157, 95, 0.15)',
        'luxury-hover': '0 30px 60px rgba(197, 157, 95, 0.25)',
        'glow-gold': '0 0 20px rgba(197, 157, 95, 0.5)',
        'glow-gold-lg': '0 0 40px rgba(197, 157, 95, 0.3)',
      },

      borderRadius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '350ms',
        slower: '500ms',
      },

      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      zIndex: {
        hide: '-1',
        base: '0',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
      },

      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C59D5F 0%, #FFD27D 100%)',
        'gradient-dark': 'linear-gradient(135deg, #050505 0%, #1F2937 100%)',
        'gradient-luxury': 'linear-gradient(135deg, rgba(197, 157, 95, 0.1) 0%, rgba(255, 210, 125, 0.05) 100%)',
      },

      backdropFilter: {
        'glass': 'blur(10px)',
        'glass-md': 'blur(16px)',
        'glass-lg': 'blur(24px)',
      },

      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(197, 157, 95, 0.5)',
            opacity: '1',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(197, 157, 95, 0.8)',
            opacity: '0.8',
          },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        // Glass effect
        '.glass': {
          '@apply backdrop-blur-md bg-white/10 border border-white/20': {},
        },
        '.glass-accent': {
          '@apply backdrop-blur-md bg-[#050505]/50 border border-[#C59D5F]/20': {},
        },

        // Gradient text
        '.gradient-gold-text': {
          '@apply bg-gradient-to-r from-[#C59D5F] to-[#FFD27D] bg-clip-text text-transparent': {},
        },
        '.gradient-purple-text': {
          '@apply bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent': {},
        },

        // Premium button
        '.btn-premium': {
          '@apply px-8 py-4 bg-[#C59D5F] text-white font-semibold rounded-lg hover:bg-[#B8915A] transition-all duration-300 shadow-lg hover:shadow-luxury-hover': {},
        },
        '.btn-premium-outline': {
          '@apply px-8 py-4 border-2 border-[#C59D5F] text-[#C59D5F] font-semibold rounded-lg hover:bg-[#C59D5F]/10 transition-all duration-300': {},
        },

        // Navy background
        '.navy-bg': {
          '@apply bg-[#050505]': {},
        },

        // Section padding
        '.section-padding': {
          '@apply py-24 lg:py-32': {},
        },
      });
    },
  ],
};
