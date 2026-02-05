/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                altinbas: {
                    blue: '#517e9f',
                    gold: '#D4AF37',
                    gray: '#F5F5F5',
                    dark: '#333333'
                }
            }
        },
    },
    plugins: [],
}
