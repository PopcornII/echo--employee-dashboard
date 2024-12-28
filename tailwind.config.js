/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./*",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    './components/**/*.{js,ts,jsx,tsx}',
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/_document.tsx", 
  ],
  theme: {
    extend: {
      colors: {
          primary: '#1DA1F2',
          secondary: '#14171A',
      },
    },
  },
  plugins: [
    //   plugin(function ({ addComponents, theme }) {
    //     addComponents({
    //         '.btn': {
    //             padding: '1rem 1.5rem',
    //             borderRadius: '0.5rem',
    //             fontWeight: '600',
    //             display: 'inline-block',
    //             textAlign: 'center',
    //         },
    //         '.btn-primary': {
    //             backgroundColor: theme('colors.primary'),
    //             color: '#fff',
    //             '&:hover': {
    //                 backgroundColor: theme('colors.primary-dark'),
    //             },
    //         },
    //         '.btn-secondary': {
    //             backgroundColor: theme('colors.secondary'),
    //             color: '#fff',
    //             '&:hover': {
    //                 backgroundColor: theme('colors.secondary-dark'),
    //             },
    //         },
    //     });
    // }),
    
  ],
}

