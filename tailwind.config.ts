import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // IronRidge surface palette
        steel: {
          DEFAULT: '#1a1f2e',
          mid: '#252b3b',
          light: '#2f3750',
        },
        iron: '#3d4560',
        navy: '#111520',
        // Brand
        amber: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          dim: 'rgba(245,158,11,0.12)',
        },
        // Semantic
        ir: {
          red: '#ef4444',
          green: '#22c55e',
          blue: '#3b82f6',
          orange: '#f97316',
          text: '#e8eaf0',
          'text-dim': '#a8b2c4',
          border: 'rgba(255,255,255,0.07)',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
        sans: ['Barlow', 'sans-serif'],
      },
      fontSize: {
        'label': ['11px', { letterSpacing: '0.08em', fontWeight: '600' }],
        'badge': ['10px', { letterSpacing: '0.06em', fontWeight: '700' }],
      },
      borderRadius: {
        ir: '8px',
        sheet: '16px',
        grade: '6px',
        badge: '4px',
        pill: '20px',
      },
      boxShadow: {
        fab: '0 4px 20px rgba(245,158,11,0.4)',
        toast: '0 6px 24px rgba(0,0,0,0.5)',
        sheet: '0 -4px 32px rgba(0,0,0,0.4)',
      },
      // Touch target sizes — shop-optimized
      minHeight: {
        touch: '60px',    // standard touch target
        'touch-lg': '64px', // large touch target (nav, primary actions)
      },
      height: {
        touch: '60px',
        'touch-lg': '64px',
        'nav': '72px',
        'header': '60px',
      },
      animation: {
        'slide-up': 'slideUp 0.25s cubic-bezier(0.32,0.72,0,1)',
        'fade-up': 'fadeUp 0.2s ease',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateX(-50%) translateY(8px)' },
          to: { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
      },
      spacing: {
        'nav': '72px',
        'header': '60px',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}

export default config
