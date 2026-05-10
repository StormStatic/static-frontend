/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          bg:  '#FDF8F1',
          50:  '#FFF7ED',
          100: '#FAF7F2',
          200: '#F5EFE3',
          300: '#F0E6D6',
        },
      },
      boxShadow: {
        card:  '0 8px 32px rgba(234,88,12,0.10)',
        btn:   '0 4px 14px rgba(249,115,22,0.35)',
        modal: '0 24px 60px rgba(28,25,23,0.22)',
      },
    },
  },
  plugins: [],
};
