/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors from PRD
        primary: '#457B9D',      // Medical blue
        'primary-dark': '#3A6B8A',
        'primary-light': '#5A8BB0',
        secondary: '#E63946',    // Red accent
        'secondary-dark': '#D63031',
        'secondary-light': '#F56565',
        success: '#06D6A0',      // Green
        'success-dark': '#05B894',
        'success-light': '#07D6A0',
        background: '#FFFFFF',   // Clean white
        'background-alt': '#F8F9FA',
        text: '#1D3557',         // Navy
        'text-light': '#457B9D',
        'text-muted': '#6B7280',
        neutral: '#F8F9FA',
        'neutral-dark': '#E5E7EB',
        warning: '#F4A261',
        error: '#E63946',
        info: '#457B9D'
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
