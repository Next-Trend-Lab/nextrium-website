import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#071628',
          DEFAULT: '#0D233D',
          mid: '#163352',
        },
        orange: {
          DEFAULT: '#DB6727',
          warm: '#E8843A',
          fire: '#C4521A',
        },
        teal: '#0A8B8B',
        gold: '#D4A843',
        slate: '#4A6FA5',
      },
      fontFamily: {
        exo: ['Exo 2', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
