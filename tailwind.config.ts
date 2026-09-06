import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#EEEFE8",
          bgRaised: "#F7F7F2",
          ink: "#1B221D",
          inkSoft: "#4A534C",
          line: "#D3D6C9",
          accent: "#1F4D3F",
          accentSoft: "#DCE6DF",
          accent2: "#C4761F",
          accent2Soft: "#F3E3CC",
          card: "#FFFFFE",
        },
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
