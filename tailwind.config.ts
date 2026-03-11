import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          gold: "#C9A962",
          charcoal: "#1A1A1A",
          "charcoal-premium": "#0A0A0B",
          "gold-shimmer": "#C9A962",
          ivory: "#FAF8F5",
          white: "#FFFEF9",
        },
        secondary: {
          sage: "#8B9A7D",
          rose: "#C4A4A4",
          slate: "#4A4A4A",
          pearl: "#E8E4DF",
        },
        semantic: {
          success: "#4A7C59",
          error: "#C45C5C",
          warning: "#D4A84B",
        }
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(to right, #8B7355, #C9A962, #E8D3A3)",
        "gold-gradient-vertical": "linear-gradient(to bottom, #8B7355, #C9A962, #E8D3A3)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
