
import type { Config } from "tailwindcss";
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "3xl": "1600px",
        "4xl": "1800px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom Premium Colors
        brand: {
          dark: "hsl(var(--background))", // Adapts to theme background (White/Black)
          light: "hsl(var(--foreground))", // Adapts to theme foreground (Black/White)
          accent: "hsl(var(--accent))", // Vibrant Orange
          orange: "hsl(var(--accent))", // Vibrant Orange
          gray: "hsl(var(--muted-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
        display: ['"Playfair Display"', "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        move: {
          "0%": { transform: "translateX(-200px)" },
          "100%": { transform: "translateX(200px)" },
        },
        "border-flow-1": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(200%)" },
        },
        "border-flow-2": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(200%)" },
        },
        "border-flow-3": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-200%)" },
        },
        "border-flow-4": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-200%)" },
        },
        "particle-explosion": {
          "0%": { transform: "translate(-50%, -50%) scale(1)", opacity: "0" },
          "20%": { opacity: "1" },
          "100%": { transform: "translate(calc(-50% + var(--x, 20px)), calc(-50% + var(--y, 20px))) scale(0)", opacity: "0" },
        },
        "ring-pulse": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "spark-flash": {
          "0%": { transform: "rotate(var(--r, 0deg)) translateX(0) scale(1)", opacity: "1" },
          "100%": { transform: "rotate(var(--r, 0deg)) translateX(30px) scale(0)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        move: "move 5s linear infinite",
        "border-flow-1": "border-flow-1 2s linear infinite",
        "border-flow-2": "border-flow-2 2s linear infinite",
        "border-flow-3": "border-flow-3 2s linear infinite",
        "border-flow-4": "border-flow-4 2s linear infinite",
        "particle-explosion": "particle-explosion 0.6s ease-out forwards",
        "ring-pulse": "ring-pulse 0.6s ease-out forwards",
        "spark-flash": "spark-flash 0.6s ease-out forwards",
      },
      transitionTimingFunction: {
        "elastic-toggle": "cubic-bezier(0, -0.02, 0.4, 1.25)",
        "elastic-circle": "cubic-bezier(0, -0.02, 0.35, 1.17)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
  ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
