/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // 🟢 Boş daire (yeşil)
    "bg-green-300",
    "text-green-900",
    "hover:bg-green-400",

    // 🟠 Rezerve daire (turuncu)
    "bg-orange-300",
    "text-orange-900",
    "hover:bg-orange-400",

    // 🔴 Satıldı daire (kırmızı)
    "bg-red-300",
    "text-red-900",
    "hover:bg-red-400",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
