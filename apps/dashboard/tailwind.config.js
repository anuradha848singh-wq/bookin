/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./app/(studio)/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/builder/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          violet: 'var(--brand-violet)',
          'violet-light': 'var(--brand-violet-light)',
          'violet-soft': 'var(--brand-violet-soft)',
          'violet-mid': 'var(--brand-violet-mid)',
          indigo: 'var(--brand-indigo)',
          'indigo-soft': 'var(--brand-indigo-soft)',
        },
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'sidebar': '1px 0 0 0 var(--border-default)',
      }
    },
  },
  plugins: [],
}
