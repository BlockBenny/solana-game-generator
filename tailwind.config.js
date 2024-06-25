module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        purple: {
          900: '#4C1D95',
        },
        indigo: {
          900: '#312E81',
        },
        blue: {
          900: '#1E3A8A',
        },
      },
    },
  },
  plugins: [],
};
