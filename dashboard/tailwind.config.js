/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#457B9D',
        secondary: '#E63946', 
        success: '#06D6A0',
        background: '#FFFFFF',
        text: '#1D3557',
        neutral: '#F8F9FA'
      },
      spacing: {
        'card': '16px',
        'section': '20px',
        'component': '8px'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
