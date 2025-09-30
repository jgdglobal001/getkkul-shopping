/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'title': ['Open Sans', 'sans-serif'],
        'body': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'theme-color': '#0c55aa',
        'light-bg': '#f4f7f9',
        'theme-white': '#ffffff',
        'light-yellow': '#ffd43a',
        'border-color': '#eaebed',
        'sky-color': '#0989ff',
        'light-text': '#55585b',
      },
    },
  },
  plugins: [],
}
