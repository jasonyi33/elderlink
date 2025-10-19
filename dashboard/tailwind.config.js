/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY PALETTE (PRD Lines 1696-1699)
        primary: {
          DEFAULT: '#457B9D',    // Medical blue
          50: '#F0F7FB',         // Ultra light for subtle backgrounds
          100: '#E3F2FD',        // Light backgrounds (WCAG AA compliant)
          200: '#B3D9F2',        // Lighter variant
          300: '#83C0E9',        // Light variant
          400: '#6AAEDF',        // Medium-light variant
          500: '#457B9D',        // DEFAULT
          600: '#3A698C',        // Darker for hover states
          700: '#2F567A',        // Dark variant
          800: '#244368',        // Darker variant
          900: '#2C5570',        // Ultra dark for high contrast text
        },

        // SECONDARY/ACCENT (PRD Lines 1697, 1699)
        secondary: {
          DEFAULT: '#1D3557',    // Trust teal/navy
          light: '#2D4563',
          dark: '#0D1D2F',
        },

        accent: {
          DEFAULT: '#A8DADC',    // Highlight cyan (PRD specified)
          light: '#D4EEEF',
          dark: '#7BC5C9',
        },

        // SEMANTIC COLORS (PRD Lines 1700-1703)
        success: {
          DEFAULT: '#2A9D8F',    // CORRECTED from #06D6A0 to match PRD
          50: '#F0FAF8',         // Ultra light
          100: '#D4F1ED',        // Light backgrounds (WCAG AA: 5.2:1 contrast)
          500: '#2A9D8F',        // DEFAULT
          600: '#258A7D',        // Medium dark
          700: '#1F7A6F',        // Dark variant
          900: '#1A6259',        // Ultra dark for high contrast
        },

        warning: {
          DEFAULT: '#F4A261',    // Correct from PRD
          50: '#FEF9F3',         // Ultra light
          100: '#FEF3E8',        // Light backgrounds (WCAG AA compliant)
          500: '#F4A261',        // DEFAULT
          600: '#F29A4F',        // Medium dark
          700: '#E08B47',        // Dark variant
          900: '#C67639',        // Ultra dark
        },

        error: {
          DEFAULT: '#E63946',    // Correct from PRD
          50: '#FEF5F6',         // Ultra light
          100: '#FDECEE',        // Light backgrounds (WCAG AA compliant)
          500: '#E63946',        // DEFAULT
          600: '#D93440',        // Medium dark
          700: '#C82333',        // Dark variant
          900: '#A61E2A',        // Ultra dark
        },

        // NEUTRALS (PRD Line 1704)
        neutral: {
          DEFAULT: '#F8F9FA',    // Clean gray
          50: '#FAFBFC',         // Ultra light
          100: '#F8F9FA',        // DEFAULT
          200: '#E9ECEF',        // Light dark
          300: '#DEE2E6',        // Medium
          400: '#CED4DA',        // Medium dark
          500: '#ADB5BD',        // Dark
          600: '#6C757D',        // Darker
          700: '#495057',        // Very dark
          800: '#343A40',        // Ultra dark
          900: '#212529',        // Almost black
        },

        // TEXT COLORS (PRD Lines 1698, 1700)
        text: {
          DEFAULT: '#1D3557',    // Navy (WCAG AAA: 12.63:1 on white)
          light: '#457B9D',      // Lighter for less emphasis
          muted: '#6C757D',      // WCAG AA: 4.54:1 on white
          'muted-dark': '#495057', // WCAG AAA: 8.59:1 on white (for critical labels)
        },

        // BACKGROUND COLORS
        background: {
          DEFAULT: '#FFFFFF',    // Clean white
          alt: '#F8F9FA',        // Subtle gray background
        },
      },
      spacing: {
        // Design System Spacing from PRD
        'card': '16px',      // Compact padding
        'section': '20px',   // Margins
        'component': '8px',  // Small spacing
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        // Projector optimization
        'projector-xs': ['0.75rem', { lineHeight: '1.2' }],
        'projector-sm': ['0.875rem', { lineHeight: '1.3' }],
        'projector-base': ['1rem', { lineHeight: '1.4' }],
        'projector-lg': ['1.125rem', { lineHeight: '1.5' }],
        'projector-xl': ['1.25rem', { lineHeight: '1.6' }],
        'projector-2xl': ['1.5rem', { lineHeight: '1.6' }],
        'projector-3xl': ['1.875rem', { lineHeight: '1.7' }]
      },
      boxShadow: {
        // Material Design shadows
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      transitionDuration: {
        '300': '300ms',
        '500': '500ms'
      },
      screens: {
        // Mobile-first responsive breakpoints
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'projector': '1920px'  // Projector optimization
      }
    },
  },
  plugins: [],
}
