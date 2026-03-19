import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:        { DEFAULT: '#F5FAF7', dark: '#0A0F0D' },
        surface:   { DEFAULT: '#F0F7F4', dark: '#0F1A14' },
        surface2:  { DEFAULT: '#E8F3EE', dark: '#0F1F17' },
        border:    { DEFAULT: '#C8DDD6', dark: '#1F5C3E' },
        accent:    { DEFAULT: '#1A8C5B', dark: '#2ECC8A' },
        highlight: { DEFAULT: '#0B6640', dark: '#7EFFD4' },
        textc:     { DEFAULT: '#0D1F17', dark: '#E8F3EE' },
        muted:     { DEFAULT: '#5A7A6E', dark: '#6B9E85' },
        amber:     { DEFAULT: '#B87A0A', dark: '#E6A020' },
        danger:    { DEFAULT: '#C0392B', dark: '#F87171' },
      },
    },
  },
  plugins: [],
}

export default config
