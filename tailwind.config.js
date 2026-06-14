/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        toss: {
          blue: '#3182F6',
          'blue-50': '#E8F3FF',
          'blue-600': '#1B64DA',
          'blue-700': '#1957C2',
          grey: {
            50: '#F9FAFB',
            100: '#F2F4F6',
            150: '#EEF0F2',
            200: '#E5E8EB',
            300: '#D1D6DB',
            400: '#B0B8C1',
            500: '#8B95A1',
            600: '#6B7684',
            700: '#4E5968',
            800: '#333D4B',
            900: '#191F28',
          },
          red: '#F04452',
          green: '#03B26C',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        'toss-m': '12px',
        'toss-l': '14px',
        'toss-xl': '16px',
        'toss-2xl': '20px',
        'toss-3xl': '24px',
        'toss-full': '999px',
      },
      boxShadow: {
        'toss-1': '0 1px 2px rgba(25, 31, 40, 0.04), 0 1px 1px rgba(25, 31, 40, 0.04)',
        'toss-2': '0 4px 12px rgba(25, 31, 40, 0.06), 0 1px 2px rgba(25, 31, 40, 0.04)',
        'toss-3': '0 12px 32px rgba(25, 31, 40, 0.10), 0 2px 6px rgba(25, 31, 40, 0.06)',
      },
      transitionTimingFunction: {
        toss: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
