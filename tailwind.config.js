/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js,jsx,php}',
    "!./node_modules/**/*.*"
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'serif'],
      },
    },
  },
  plugins: [],
};
