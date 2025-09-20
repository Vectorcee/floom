import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Brand tokens (use CSS vars for easy theming)
        floom: {
          bg: "hsl(var(--floom-bg))",           // #000000
          accent: "hsl(var(--floom-accent))",   // #a7f139
          fg: "hsl(var(--floom-fg))",           // #ffffff
          hairline: "hsl(var(--floom-hairline))", // accent at 40%
        },
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
        xl: "28px",
      },
      boxShadow: {
        floomSoft: "0 10px 24px rgba(167,241,57,0.08)",
        floomGlow: "0 0 40px rgba(167,241,57,0.35)",
      },
      keyframes: {
        ringPulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(167,241,57,0.6)" },
          "70%": { boxShadow: "0 0 0 20px rgba(167,241,57,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(167,241,57,0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        ringPulse: "ringPulse 1.8s cubic-bezier(0.16,1,0.3,1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        headline: ["Blacknode", "Inter", "system-ui", "sans-serif"],
        body: ["Comfortaa", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".hairline": {
          borderColor: "hsl(var(--floom-hairline))",
        },
      });
    }),
  ],
};

export default config;
