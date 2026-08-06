/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16241F",
        paper: "#EDF3EE",
        card: "#FBFCFA",
        forest: "#1F4D3E",
        marigold: "#E8A23D",
        plum: "#8B3A62",
        sage: "#6B7A73",
        border: "#D9E1DA",
        cream: "#F4EFD8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
