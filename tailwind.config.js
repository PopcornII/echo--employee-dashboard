/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./*",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    './components/**/*.{js,ts,jsx,tsx}',
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
          primary: '#1DA1F2',
          secondary: '#14171A',
          green: '#15803d',
          navyblue: '#312e81',
          'light-gray': '#E9E9E9',
          'dark-gray': '#444444'
      },
      fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New","monospace"],
      'display': ['Oswald'],
      'body': ['"Open Sans"',],
    }

    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    end: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
    utilities: {
      '.no-scrollbar': {
        /* Hide scrollbar for modern browsers */
        '-ms-overflow-style': 'none', /* Internet Explorer 10+ */
        'scrollbar-width': 'none',   /* Firefox */
      },
      '.no-scrollbar::-webkit-scrollbar': {
        display: 'none',             /* Chrome, Safari, and Opera */
      },
    }
  }, 
  plugins: [
  
    
  ],
}

