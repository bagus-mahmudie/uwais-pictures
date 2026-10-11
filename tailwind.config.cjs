/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,js}"],
  theme: {
    extend: {
      colors: {
        "uwais-bg": "#050507",
        "uwais-card": "#101015",
        "uwais-card-soft": "#FFFFFF0D",
        "uwais-red": "#ff2e3a",
        "uwais-red-soft": "#ff4d5a",
        "uwais-text": "#e5e7eb",
        "uwais-muted": "rgb(255, 255, 255, 0.7)",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0,0,0,0.6)",
        card: "0 16px 35px rgba(0,0,0,0.55)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
