// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    //"./index.html", // Ensure that index.html is in your project root if you're using it.
    "./src/**/*.{js,ts,jsx,tsx}", // This will scan all JS, TS, JSX, and TSX files in the 'src' folder.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
