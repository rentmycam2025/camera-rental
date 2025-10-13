/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - change these to update entire theme
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // Main brand color
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        // Accent colors
        accent: {
          success: "#16a34a",
          error: "#dc2626",
          warning: "#d97706",
          info: "#0284c7",
        },
      },
      animation: {
        fadeInOut: "fadeInOut 2s ease-in-out",
        slideUp: "slideUp 0.5s ease-out",
        // Add these new animations
        fadeInUp: "fadeInUp 0.8s ease-out",
        scaleIn: "scaleIn 0.5s ease-out",
      },
      keyframes: {
        fadeInOut: {
          "0%, 100%": { opacity: 0, transform: "translateY(10px)" },
          "10%, 90%": { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        // Add these new keyframes
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      // Add spacing scale for consistency
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      // Add max-width for better container control
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
    },
  },
  plugins: [],
};
