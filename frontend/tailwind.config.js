/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#3D1A8E',
          'purple-light': '#5B2FBB',
          'purple-faint': '#EDE8FA',
          'purple-dark': '#2A1166',
          orange: '#F5820D',
          'orange-light': '#FEF0E0',
          'orange-dark': '#D4690A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FB',
          tertiary: '#EFF1F5',
          border: '#E4E7EF',
          'border-strong': '#C8CEDA',
        },
        text: {
          primary: '#0F1120',
          secondary: '#4A5168',
          muted: '#8B92A9',
          inverse: '#FFFFFF',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,17,32,0.06), 0 1px 2px rgba(15,17,32,0.04)',
        'card-hover': '0 4px 12px rgba(15,17,32,0.10), 0 1px 3px rgba(15,17,32,0.06)',
        modal: '0 24px 80px rgba(15,17,32,0.18)',
        dropdown: '0 6px 20px rgba(15,17,32,0.12)',
        'inner-sm': 'inset 0 1px 2px rgba(15,17,32,0.06)',
      },
      borderRadius: {
        card: '14px',
        button: '8px',
        input: '8px',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
