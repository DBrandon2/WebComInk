/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        opendyslexic: ["OpenDyslexic", "sans-serif"],
      },
      colors: {
        success: "#24D199",
        error: "#FF5A5F",
        warning: "#F9C74F",
      },
    },
  },
  plugins: [],
};
