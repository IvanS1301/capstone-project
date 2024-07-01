/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#1f2937",
        "light-white": "rgba(255,255,255,0.18)",
        "black-gray": "#f8fafc",
        "blue-gray": "#141b2d"
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      display: ["focus-group"]
    }
  }
};

