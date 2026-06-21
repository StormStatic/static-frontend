/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas:  '#F5F1EA',
        surface: '#FFFFFF',
        inset:   '#FBF8F2',
        border:  '#EBE4D8',
        ink:     '#1F1D1B',
        muted:   '#857F77',
        walnut:  '#2A1F1A',
        accent:  '#B4513D',
        success: '#6FB28A',
        danger:  '#B4413D',
      },
      borderRadius: {
        pill:  '9999px',
        card:  '24px',
        field: '16px',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.25s ease-out',
      },
    },
  },
  plugins: [],
}