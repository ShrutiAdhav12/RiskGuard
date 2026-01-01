export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#5968ff',
          dark: '#362be4'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5968ff 0%, #362be4 100%)',
        'gradient-primary-reverse': 'linear-gradient(135deg, #362be4 0%, #5968ff 100%)'
      }
    }
  },
  plugins: []
}
