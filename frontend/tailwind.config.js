/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 70px rgba(8, 30, 86, 0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(59,130,246,0.15), transparent 40%), radial-gradient(circle at bottom right, rgba(16,185,129,0.12), transparent 30%)',
      },
    },
  },
  plugins: [],
};