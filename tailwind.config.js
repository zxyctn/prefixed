/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        dark: {
          primary: '#0093FF',
          secondary: '#FFFFFF',
          accent: '#BD00FF',
          neutral: '#484848',
          'base-100': '#0B0B0B',
          'base-100-content': '#FFFFFF',
          info: '#00E0FF',
          success: '#42FF00',
          warning: '#FFE500',
          error: '#FF0000',
          '--rounded-btn': '0',
          '--rounded-box': '0',
          body: {
            color: '#ffffff',
          },
          '.btn-primary': {
            color: '#FFFFFF',
          },
          '.btn-secondary': {
            color: '#000000',
          },
        },

        light: {
          primary: '#0093FF',
          secondary: '#000000',
          accent: '#BD00FF',
          neutral: '#D1D1D1',
          'base-100': '#FFFFFF',
          info: '#00E0FF',
          success: '#42FF00',
          warning: '#FFE500',
          error: '#FF0000',
          '--rounded-btn': '0',
          '--rounded-box': '0',
          body: {
            color: '#000000',
          },
          '.btn-primary': {
            color: '#FFFFFF',
          },
          '.btn-secondary': {
            color: '#ffffff',
          },
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
