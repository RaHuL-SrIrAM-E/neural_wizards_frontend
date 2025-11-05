/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wf: {
          red: {
            DEFAULT: '#D71E28',
            light: '#E84855',
            dark: '#B01820',
          },
          yellow: {
            DEFAULT: '#FFCD41',
            light: '#FFE082',
            dark: '#F4B000',
          },
        },
      },
    },
  },
  plugins: [],
};
