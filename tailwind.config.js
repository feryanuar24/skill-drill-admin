/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3366cc",
          hover: "#2952a3",
          light: "#eef3fc",
        },
        secondary: {
          DEFAULT: "#8899dd",
          hover: "#7386cb",
        },
        danger: {
          DEFAULT: "#dd3333",
          hover: "#bb2222",
          light: "#ffe6e6",
        },
        success: {
          DEFAULT: "#33aa33",
          hover: "#2a8b2a",
          light: "#e6ffe6",
        },
        warning: {
          DEFAULT: "#ffaa00",
          hover: "#e09600",
          light: "#fff8e6",
        },
      },
      borderRadius: {
        custom: "8px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.1)",
        elevated: "0 10px 40px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
