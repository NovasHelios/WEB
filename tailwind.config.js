/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "Noto Sans KR", "sans-serif"],
      },
      fontSize: {
        xs: "var(--font-xs)",
        sm: "var(--font-sm)",
        base: "var(--font-md)",
        lg: "var(--font-lg)",
        xl: "var(--font-xl)",
        "2xl": "var(--font-2xl)",
        "3xl": "var(--font-3xl)",
      },
      fontWeight: {
        normal: "var(--font-regular)",
        medium: "var(--font-medium)",
        semibold: "var(--font-semibold)",
        bold: "var(--font-bold)",
        extrabold: "var(--font-bold)",
        black: "var(--font-bold)",
      },
    },
  },
  plugins: [],
}
