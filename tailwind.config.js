/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html', // Si usas index.html
    './src/**/*.{vue,js,ts,jsx,tsx}', // Busca en todos los archivos .vue y JS dentro de la carpeta src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

