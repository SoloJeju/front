import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        primary: '#F78938',
      },
    },
  },
  plugins: [],
};

export default config;
