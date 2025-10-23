import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans-win98': ['"Inter"', '"Tahoma"', '"Verdana"', 'sans-serif'],
        'pixelated': ['"Pixelify Sans"', 'sans-serif'],
      },
      colors: {
        'win-gray': '#c0c0c0',
        'win-blue': '#000080',
      },
      // You can add box-shadow utilities for the 3D effect if needed
      boxShadow: {
        'win-outset': 'inset -1px -1px #000, inset 1px 1px #fff',
        'win-inset': 'inset 1px 1px #000, inset -1px -1px #fff',
      }
    },
  },
  plugins: [],
};
export default config;
