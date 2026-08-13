import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "#86B81C",
          dark: "#5C8314",
        },
        lag: {
          bg: "#FFFFFF",
          "bg-alt": "#F5F7F0",
          text: "#383838",
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
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
