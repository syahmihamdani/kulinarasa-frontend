/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kulinarasa: {
          darkblue: '#0b141b',
          brown: '#482c28',
          orange: '#9a3a0a',
          yellow: '#b77d11',
          gray: '#8b8b83'
        },
      },
      fontFamily:{
        kulinarasa: ["Anzicar Serif"]
      },
    },
  },
  plugins: [],
}