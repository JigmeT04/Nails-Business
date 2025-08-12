import type { Config } from "tailwindcss"



const config = {

  darkMode: "class",

  content: [

    './pages/**/*.{ts,tsx}',

    './components/**/*.{ts,tsx}',

    './app/**/*.{ts,tsx}',

    './src/**/*.{ts,tsx}',

  ],

  prefix: "",

  theme: {

    container: {

      center: true,

      padding: "2rem",

      screens: {

        "2xl": "1400px",

      },

    },

    extend: {

      colors: {
        'brand': {
          'cream': '#FBF7F4',        // Background cream
          'pink-soft': '#F4E6E8',    // Soft pink accents
          'pink-light': '#E8D5D7',   // Light pink
          'taupe': '#8B7D6B',        // Main brand color (YVD NAILS)
          'taupe-dark': '#6B5D4F',   // Darker taupe
          'taupe-light': '#A69588',  // Lighter taupe  
          'brown': '#5D4E42',        // Deep brown
          'warm-beige': '#F0EBE3',   // Warm beige
          'dusty-pink': '#D4A5A5',   // Dusty pink accents
          'sage': '#9B9B8A',         // Sage green undertone
        },
        primary: {
          50: '#FBF7F4',
          100: '#F0EBE3', 
          200: '#E8D5D7',
          300: '#D4A5A5',
          400: '#A69588',
          500: '#8B7D6B',
          600: '#6B5D4F',
          700: '#5D4E42',
          800: '#4A3F36',
          900: '#3A312A',
        }
      },

      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'script': ['Dancing Script', 'cursive'],
        'elegant': ['Cormorant Garamond', 'serif'],
        'title': ['Cinzel', 'serif'],        // For main YVD NAILS title
        'body': ['Source Serif Pro', 'serif'], // For body text
      },

      keyframes: {

        "accordion-down": {

          from: { height: "0" },

          to: { height: "var(--radix-accordion-content-height)" },

        },

        "accordion-up": {

          from: { height: "var(--radix-accordion-content-height)" },

          to: { height: "0" },

        },

      },

      animation: {

        "accordion-down": "accordion-down 0.2s ease-out",

        "accordion-up": "accordion-up 0.2s ease-out",

      },

    },

  },

  plugins: [require("tailwindcss-animate")],

} satisfies Config



export default config