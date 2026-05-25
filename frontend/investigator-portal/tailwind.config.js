/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05080f",
        navy: {
          950: "#0a0e1a",
          900: "#0f1729",
          800: "#152238",
          700: "#1c2d4a",
        },
        cyber: {
          DEFAULT: "#1e6bff",
          glow: "#3b9eff",
          dim: "#0d3a8c",
        },
        intel: {
          teal: "#14b8a6",
          amber: "#f59e0b",
          crimson: "#ef4444",
          violet: "#8b5cf6",
        },
        glass: "rgba(15, 23, 41, 0.72)",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(30, 107, 255, 0.35)",
        "glow-teal": "0 0 20px rgba(20, 184, 166, 0.3)",
        "glow-crimson": "0 0 20px rgba(239, 68, 68, 0.35)",
        panel: "0 4px 32px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "grid-cyber":
          "linear-gradient(rgba(30,107,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.06) 1px, transparent 1px)",
        "radial-command":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(30,107,255,0.18), transparent 55%)",
      },
      animation: {
        pulse_intel: "pulse_intel 3s ease-in-out infinite",
        scan: "scan 8s linear infinite",
      },
      keyframes: {
        pulse_intel: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
};
