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
        /**
         * デザイン試作（トップページ・Roomba商品詳細）専用の新配色トークン。
         * 既存の brand.* とは完全に別名前空間にし、既存ページのクラス名には一切触れない。
         * 試作がレビューを通過してサイト全体へ展開する場合は、この時点で brand.* を置き換える。
         */
        canvas: {
          bg: "#F7F8FA",
          card: "#FFFFFF",
          ink: "#17253D",
          inkSoft: "#4B5C78",
          line: "#E3E7EE",
          primary: "#087F8C",
          primaryHover: "#066B76",
          primarySoft: "#E1F2F2",
          accent: "#F2A65A",
          accentSoft: "#FDECD9",
          /** F2A65Aそのままだと本文・重要情報の文字色としてはコントラスト不足のため、装飾用の
           *  accentとは別に、十分な明度差を確保した文字用の濃色バリアントを用意する。 */
          accentText: "#9C5F1E",
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
