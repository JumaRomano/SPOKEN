/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#38bdf8', // sky-400
                    DEFAULT: '#0284c7', // sky-600
                    dark: '#0c4a6e', // sky-900
                    gradientStart: '#0f172a', // slate-900 (Deep Blue/Black)
                    gradientEnd: '#0ea5e9', // sky-500 (Bright Blue/Cyan)
                },
                secondary: {
                    light: '#f1f5f9', // slate-100
                    DEFAULT: '#334155', // slate-700
                    dark: '#0f172a', // slate-900
                },
                success: {
                    light: '#4ade80',
                    DEFAULT: '#22c55e',
                    dark: '#15803d',
                },
                danger: {
                    light: '#fb7185',
                    DEFAULT: '#e11d48',
                    dark: '#9f1239',
                },
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                ],
            },
            borderRadius: {
                'sm': '0.125rem',
                'md': '0.375rem', // 6px
                'lg': '0.5rem',
                'full': '9999px',
            },
        },
    },
    plugins: [],
}
