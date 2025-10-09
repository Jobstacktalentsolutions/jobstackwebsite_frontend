/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // if using the old Pages Router
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E3D54", // deep teal-blue background (hero section)
        mist: "#EAF3F7", // light accent color
        brand: {
          50: "#e8f2f7",
          100: "#d3e6ef",
          600: "#2c7aa0",
          700: "#1f5e7c",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(3, 30, 47, 0.18)", // soft card shadow
      },
      keyframes: {
        slowBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        slowBounce: "slowBounce 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
