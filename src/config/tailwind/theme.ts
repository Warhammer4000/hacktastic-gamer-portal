import { animation } from './animation';
import { colors } from './colors';
import { typography } from './typography';

export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      display: ["Clash Display", "sans-serif"],
    },
    colors,
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    keyframes: animation.keyframes,
    animation: animation.animation,
    typography,
  },
};