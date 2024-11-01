import type { Config } from "tailwindcss";
import {
  iconsPlugin,
  getIconCollections,
} from "@egoist/tailwindcss-icons";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: "#FDF9F2",
        primary: "#15A083",
        secondary: "F3CF3E"
      },
      width: {
        'main': '450px',
      }
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["tabler","mdi"])
    })
  ],
};
export default config;
