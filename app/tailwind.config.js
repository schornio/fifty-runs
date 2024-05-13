/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        atlantis: {
          100: '#f0f7d0',
          200: '#e0efa7',
          300: '#cae274',
          400: '#b2d348',
          50: '#f8fbea',
          500: '#9fc52d', // default
          600: '#73921e',
          700: '#57701b',
          800: '#47591b',
          900: '#3c4c1b',
          950: '#1f290a',
        },
        'congress-blue': {
          100: '#dcf1ff',
          200: '#b2e5ff',
          300: '#6dd1ff',
          400: '#20baff',
          50: '#eef8ff',
          500: '#00a1ff',
          600: '#0080df',
          700: '#0065b4',
          800: '#005694',
          900: '#00497e', // default
          950: '#002d51',
        },
        gold: {
          50: '#ffffe7',
          100: '#feffc1',
          200: '#fffd86',
          300: '#fff441',
          400: '#ffe60d',
          500: '#ffd700', // default
          600: '#d19e00',
          700: '#a67102',
          800: '#89580a',
          900: '#74480f',
          950: '#442604',
        },
        summer: {
          100: '#fdffc1',
          200: '#fffe86',
          300: '#fff641',
          400: '#ffe80d',
          50: '#ffffe7',
          500: '#f0cc00', // default
          600: '#d1a000',
          700: '#a67202',
          800: '#89590a',
          900: '#74480f',
          950: '#442604',
        },
      },
      typography: ({ theme }) => ({
        primary: {
          css: {
            '--tw-prose-body': theme('colors.congress-blue[900]'),
            '--tw-prose-headings': theme('colors.congress-blue[900]'),
            '--tw-prose-links': theme('colors.summer[500]'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
