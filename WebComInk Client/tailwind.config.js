const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      ...defaultTheme.screens,
      '3xl': '120rem', // Maintenant ça marche !
    },
    extend: {
      height: {
        "screen-minus-header": "calc(100vh - 80px)",
      },
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
