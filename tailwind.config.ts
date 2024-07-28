import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
"./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter, sans-serif', { fontFeatureSettings: '"cv11"' }],
      },
    },
  },
  plugins: [],
}
export default config
