import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        
        /* Emergency System Colors */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        emergency: {
          DEFAULT: "hsl(var(--emergency))",
          foreground: "hsl(var(--emergency-foreground))",
        },
        support: {
          DEFAULT: "hsl(var(--support))",
          foreground: "hsl(var(--support-foreground))",
        },
        
        /* Agent Themes */
        medical: {
          primary: "hsl(var(--medical-primary))",
          secondary: "hsl(var(--medical-secondary))",
          bg: "hsl(var(--medical-bg))",
          foreground: "hsl(var(--medical-foreground))",
        },
        police: {
          primary: "hsl(var(--police-primary))",
          secondary: "hsl(var(--police-secondary))",
          bg: "hsl(var(--police-bg))",
          foreground: "hsl(var(--police-foreground))",
        },
        electricity: {
          primary: "hsl(var(--electricity-primary))",
          secondary: "hsl(var(--electricity-secondary))",
          bg: "hsl(var(--electricity-bg))",
          foreground: "hsl(var(--electricity-foreground))",
        },
        fire: {
          primary: "hsl(var(--fire-primary))",
          secondary: "hsl(var(--fire-secondary))",
          bg: "hsl(var(--fire-bg))",
          foreground: "hsl(var(--fire-foreground))",
          border: "hsl(var(--fire-primary) / 0.2)",
        },
        
        /* Base Components */
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
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
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-emergency": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        },
        "blink": {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "pulse-emergency": "pulse-emergency 2s ease-in-out infinite",
        "blink": "blink 1s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-emergency': 'var(--gradient-emergency)',
        'gradient-medical': 'var(--gradient-medical)',
        'gradient-police': 'var(--gradient-police)',
        'gradient-electricity': 'var(--gradient-electricity)',
        'gradient-fire': 'var(--gradient-fire)',
        'gradient-hero': 'var(--gradient-hero)',
      },
      boxShadow: {
        'emergency': 'var(--shadow-emergency)',
        'medical': 'var(--shadow-medical)',
        'police': 'var(--shadow-police)',
        'electricity': 'var(--shadow-electricity)',
        'fire': 'var(--shadow-fire)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
