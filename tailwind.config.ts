import type { Config } from "tailwindcss";
import {
  iconsPlugin,
  getIconCollections,
} from "@egoist/tailwindcss-icons";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),
  ],
  safelist: [
    "i-tabler-dog-bowl", 
    "i-mdi-water",
    "i-mdi-dog-side",
    "i-mdi-toilet",
    "i-tabler-toilet-paper",
    "i-icon-park-outline-weight",
    "i-hugeicons-medicine-02",
    "i-icon-park-outline-injection",
    "i-ri-hospital-line",
    "i-ri-scissors-2-fill",
    "i-tabler-bath",
    "i-material-symbols-light-tools-pliers-wire-stripper"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: "#f5ebda",
        primary: "#326a55",
        secondary: "#FBC95C",
      },
      width: {
        'main': '450px',
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["tabler","mdi", "material-symbols-light","material-symbols","icon-park-outline", "hugeicons","ri"])
    }),
    flowbite.plugin(),
  ],
};
export default config;