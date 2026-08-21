import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "Arial", "Helvetica", "sans-serif"],
        serif: ["Source Serif 4", "Georgia", "Times New Roman", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "100px",
      },
      colors: {
        // ERGO Corporate Design (ergo.de)
        "ergo-red": "#8E0038",
        "ergo-red-hover": "#71022E",
        "ergo-red-dark": "#71022E",
        "ergo-red-light": "#FBF4F4",
        "ergo-pink": "#B31767",
        "ergo-ink": "#333333",
        "ergo-dark": "#262626",
        "ergo-dark-light": "#545241",
        "ergo-stone": "#545241",
        "ergo-mute": "#737373",
        "ergo-line": "#D9D9D9",
        "ergo-gray": "#F6F5F5",
        "ergo-gray-light": "#FBF4F4",
        "ergo-fog": "#F2F2F2",
        "ergo-yellow": "#FAD782",
        "ergo-coral": "#FA7D73",
        "ergo-leaf": "#B3DA8A",
        "ergo-sky": "#96C8FF",
        "ergo-check": "#009284",
        // Alt-Aliasse (bisher Allianz-Blau) → ERGO-konform remappt
        "ergo-blue": "#8E0038",
        "ergo-blue-light": "#FBF4F4",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
