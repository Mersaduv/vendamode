module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}' , "./node_modules/flowbite/**/*.js"],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'mdx': '860px',
      'lg': '1024px',
      'lg2': '1170px',
      'xl': '1280px',
      '2xl': '1536px',
      'xs': '450px', 
    },
    extend: {
      fontFamily: {
        iransans: 'IRANSansWeb',
      },
      boxShadow: {
        '3xl': '0 0 10px 3px rgba(0,0,0,0.08)',
      },
      colors: {
        gray: {},
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}
