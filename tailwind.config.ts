import type { Config } from "tailwindcss";

/**
 * Tailwind config — Design System LAG (Logiztik Alliance Group)
 * Tokens definidos en docs/design/design-system.md
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#86B81C",
          dark: "#5C8314",
        },
        lag: {
          "bg-primary": "#FFFFFF",
          "bg-secondary": "#F5F7F0",
          "text-primary": "#383838",
          "text-secondary": "#6B7280",
          border: "#E2E8E0",
        },
        semaforo: {
          verde: "#86B81C",
          amarillo: "#F59E0B",
          rojo: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
