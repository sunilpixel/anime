const matches = (query: string) =>
  typeof window !== "undefined" && window.matchMedia(query).matches;

export const prefersReducedMotion = () => matches("(prefers-reduced-motion: reduce)");
export const hasFinePointer = () => matches("(hover: hover) and (pointer: fine)");

export const queries = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
  reduce: "(prefers-reduced-motion: reduce)",
  motion: "(prefers-reduced-motion: no-preference)",
} as const;
