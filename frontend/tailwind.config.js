/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Palette
                'premium-black': '#0A0A0A',
                'premium-charcoal': '#1A1A1A',
                'premium-silver': '#C0C0C0',
                'premium-platinum': '#E5E5E5',
                'premium-gold': '#D4AF37',
                'premium-gold-light': '#F4E5B8',
                'premium-gold-dark': '#B8941F',

                // Status Colors
                'success': '#2ECC71',
                'warning': '#F39C12',
                'error': '#E74C3C',
                'info': '#3498DB',
            },
            fontFamily: {
                'display': ['"Playfair Display"', 'serif'],
                'sans': ['"Inter"', 'sans-serif'],
                'mono': ['"JetBrains Mono"', 'monospace'],
            },
            backgroundImage: {
                'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
                'gradient-card': 'linear-gradient(145deg, #1A1A1A 0%, #0F0F0F 100%)',
            },
            boxShadow: {
                'premium-sm': '0 2px 8px rgba(212, 175, 55, 0.1)',
                'premium-md': '0 4px 16px rgba(212, 175, 55, 0.15)',
                'premium-lg': '0 8px 32px rgba(212, 175, 55, 0.2)',
                'premium-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
            },
            animation: {
                'shimmer': 'shimmer 2s linear infinite',
                'fadeInUp': 'fadeInUp 0.5s ease-out',
                'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                fadeInUp: {
                    'from': {
                        opacity: '0',
                        transform: 'translateY(20px)',
                    },
                    'to': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'pulse-gold': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)' },
                    '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
                },
            },
        },
    },
    plugins: [],
}
