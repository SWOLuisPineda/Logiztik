import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        /* Design System — Colores de marca */
        brand: {
          DEFAULT: "#86B81C",
          dark: "#5C8314",
        },
        "bg-primary": "#FFFFFF",
        "bg-secondary": "#F5F7F0",
        "text-primary": "#383838",
        "text-secondary": "#6B7280",
        "border-lag": "#E2E8E0",

        /* Design System — Semáforo */
        semaforo: {
          verde: "#86B81C",
          amarillo: "#F59E0B",
          rojo: "#DC2626",
        },
      },
    },
  },
  plugins: [],
};
export default config;
