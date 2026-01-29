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
                    light: '#60A5FA', // Blue-400 (Softer, accessible highlight)
                    DEFAULT: '#2563EB', // Blue-600 (Corporate, Trustworthy)
                    dark: '#1E40AF', // Blue-800 (Deep, Authoritative)
                    // Sophisticated gradients - subtle, not flashy
                    gradientStart: '#1E293B', // Slate-800
                    gradientEnd: '#3B82F6', // Blue-500
                },
                secondary: {
                    light: '#F8FAFC', // Slate-50 (Clean background)
                    DEFAULT: '#64748B', // Slate-500 (Muted text)
                    dark: '#0F172A', // Slate-900 (High contrast heading)
                },
                success: {
                    light: '#D1FAE5', // Emerald-100
                    DEFAULT: '#10B981', // Emerald-500
                    dark: '#065F46', // Emerald-800
                },
                danger: {
                    light: '#FFE4E6', // Rose-100
                    DEFAULT: '#E11D48', // Rose-600
                    dark: '#881337', // Rose-900
                },
                // Add a specific surface color for cards to ensure depth
                surface: {
                    DEFAULT: '#FFFFFF',
                    alt: '#F1F5F9', // Slate-100
                }
            },
            fontFamily: {
                sans: [
                    'Inter', // Modern, clean
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    'sans-serif',
                ],
                serif: [
                    'Merriweather', // Readability for scripture
                    'Georgia',
                    'serif',
                ],
            },
            borderRadius: {
                'sm': '0.25rem',
                'md': '0.5rem',
                'lg': '0.75rem',
                'xl': '1rem', // Modern smooth corners
                '2xl': '1.5rem',
                'full': '9999px',
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'glow': '0 0 15px rgba(37, 99, 235, 0.3)', // Subtle primary glow
            }
        },
    },
    plugins: [],
}
