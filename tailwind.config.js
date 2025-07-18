module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Your existing colors
        primary: "#6741d9",
        "primary-light": "#7950f2",
        "background-100": "#343a40",
        "background-500": "#2b3035",
        "background-900": "#212529",
        red: "#fa5252",
        "red-dark": "#e03131",

        // New colors for enhanced UI
        purple: {
          400: "#8B5CF6",
          500: "#7C3AED",
          600: "#6D28D9",
          700: "#5B21B6",
        },
        pink: {
          400: "#EC4899",
          500: "#DB2777",
          600: "#BE185D",
        },
        yellow: {
          400: "#F59E0B",
          500: "#D97706",
        },
        gray: {
          750: "#2D3748",
          850: "#1A202C",
        },
      },
      // New extensions for animations and effects
      backdropBlur: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
        "3d": "0 15px 30px -5px rgba(0, 0, 0, 0.3)",
        "inner-xl": "inset 0 10px 20px 0 rgba(0, 0, 0, 0.5)",
      },
      animation: {
        float: "float 20s linear infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(2deg)" },
        },
      },
      transitionProperty: {
        height: "height",
        width: "width",
        transform3d: "transform, box-shadow",
      },
      scale: {
        102: "1.02",
        105: "1.05",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
