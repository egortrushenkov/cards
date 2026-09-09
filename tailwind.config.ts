import type {Config} from 'tailwindcss';

// Светлая тема: тёплый белый фон, почти чёрный текст, один красный акцент.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#fbfaf8',
        surface: '#f3f1ec',
        foreground: '#0c0c0f',
        muted: '#5f606b',
        line: 'rgba(12,12,15,0.1)',
        accent: {
          DEFAULT: '#e5323a',
          soft: 'rgba(229,50,58,0.09)',
          hot: '#c8202a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 24px 60px -24px rgba(229,50,58,0.45)',
        card: '0 30px 60px -40px rgba(12,12,15,0.35)',
      },
      keyframes: {
        marquee: {
          '0%': {transform: 'translateX(0%)'},
          '100%': {transform: 'translateX(-50%)'},
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
