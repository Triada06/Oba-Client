/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#00A651',
        'primary-yellow': '#FFD700',
        'secondary-green': '#008A42',
        'light-green': '#E8F5E8',
        'dark-green': '#006B33',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

