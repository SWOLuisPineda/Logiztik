import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-primary": "#86B81C",
        "brand-dark": "#5C8314",
        "lag-bg-secondary": "#F5F7F0",
        "lag-text-primary": "#383838",
        "lag-text-secondary": "#6B7280",
        "lag-border": "#E2E8E0",
      },
    },
  },
  plugins: [],
};
export default config;
