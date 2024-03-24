/** @type {import('tailwindcss').Config} */
export default {
  content: [,
    "./app/views/**/*.{html,js}",
    "./app/views/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#34CB7C",
        secondary: "#F4A212",
        accent: "#EFE8D8",
        accent2: "#F51F0D",
        text: {
          primary: "#00224D",
          secondary: "#222831"
        }

      }
    },
  },
  plugins: [],
}

