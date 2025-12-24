module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        'primary-dark': '#004499',
        'primary-light': '#3385dd',
        secondary: '#f0f4f8',
        accent: '#ff6b6b',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
        'gradient-light': 'linear-gradient(135deg, #f0f4f8 0%, #e0e9f5 100%)',
      }
    },
  },
  plugins: [],
}
