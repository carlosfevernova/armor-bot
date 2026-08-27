import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        panel: "#111111",
        border: "#1e1e1e",
        muted: "#888888",
        fg: "#ededed",
        accent: {
          DEFAULT: "#a78bfa",
          soft: "#7c3aed",
          dim: "#5b21b6",
        },
        ok: "#86efac",
        warn: "#fde68a",
        err: "#fca5a5",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "Cascadia Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
