import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
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
          DEFAULT: "#00B300", // Verde vivo
          foreground: "#000000", // Preto para texto
          50: "#E6FFE6",
          100: "#CCFFCC",
          200: "#99FF99",
          300: "#66FF66",
          400: "#33FF33",
          500: "#00FF00",
          600: "#00E600",
          700: "#00CC00",
          800: "#00B300",
          900: "#00B300",
        },
        secondary: {
          DEFAULT: "#CCE0FF", // Azul escuro
          foreground: "#000000", // Preto para texto
          50: "#E6F0FF",
          100: "#CCE0FF",
          200: "#99C2FF",
          300: "#66A3FF",
          400: "#3385FF",
          500: "#0066CC",
          600: "#0052A3",
          700: "#003D7A",
          800: "#002952",
          900: "#00B300",
        },
        accent: {
          DEFAULT: "#CCE0FF", // Azul escuro
          foreground: "#000000", // Preto para texto
          50: "#E6F0FF",
          100: "#CCE0FF",
          200: "#99C2FF",
          300: "#66A3FF",
          400: "#3385FF",
          500: "#0066CC",
          600: "#0052A3",
          700: "#003D7A",
          800: "#002952",
          900: "#00B300",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 179, 0, 0.7)" },
          "70%": { boxShadow: "0 0 0 10px rgba(0, 179, 0, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-green": "pulse-green 2s infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-pattern": "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
        "card-pattern": "linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 100%)",
        "green-gradient": "linear-gradient(135deg, #00B300 0%, #00CC00 50%, #00E600 100%)",
        "navy-gradient": "linear-gradient(135deg, #CCE0FF 0%, #0052A3 50%, #0066CC 100%)",
        "white-gradient": "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 50%, #EEEEEE 100%)",
      },
      boxShadow: {
        "green-glow": "0 0 20px rgba(0, 179, 0, 0.3)",
        "green-glow-lg": "0 0 40px rgba(0, 179, 0, 0.2)",
        "navy-glow": "0 0 20px rgba(0, 51, 102, 0.3)",
        "white-glow": "0 0 20px rgba(255, 255, 255, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
