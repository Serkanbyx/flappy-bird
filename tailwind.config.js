/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        game: ['"Press Start 2P"', "monospace"],
      },
      colors: {
        sky: {
          game: "#70c5ce",
        },
        ground: {
          game: "#ded895",
        },
        pipe: {
          game: "#73bf2e",
          dark: "#558b2f",
        },
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-fast": "pulse 0.8s infinite",
      },
    },
  },
  plugins: [],
};
