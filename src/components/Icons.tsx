import type { SVGProps } from "react";

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} satisfies SVGProps<SVGSVGElement>;

export const ArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Search = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);

export const Play = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" stroke="none" {...props}>
    <path d="M8 5.5v13l10-6.5z" />
  </svg>
);

export const ArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const Twitter = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" stroke="none" {...props}>
    <path d="M21 5.6a7.4 7.4 0 0 1-2.1.6 3.7 3.7 0 0 0 1.6-2 7.4 7.4 0 0 1-2.3.9A3.7 3.7 0 0 0 11.9 8a10.4 10.4 0 0 1-7.6-3.8 3.7 3.7 0 0 0 1.1 4.9 3.6 3.6 0 0 1-1.7-.5 3.7 3.7 0 0 0 3 3.6 3.7 3.7 0 0 1-1.7.1 3.7 3.7 0 0 0 3.5 2.6A7.4 7.4 0 0 1 3 16.4a10.4 10.4 0 0 0 5.7 1.7c6.8 0 10.5-5.6 10.5-10.5v-.5A7.5 7.5 0 0 0 21 5.6z" />
  </svg>
);

export const Instagram = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const YouTube = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="M10.5 9.5v5l4.2-2.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const Discord = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" stroke="none" {...props}>
    <path d="M19.3 6.4A16 16 0 0 0 15.4 5l-.3.5a12 12 0 0 1 3.4 1.7 13.7 13.7 0 0 0-12.9 0A12 12 0 0 1 9 5.5L8.6 5a16 16 0 0 0-3.9 1.4C2.2 10.1 1.5 13.7 1.9 17.2A16.2 16.2 0 0 0 6.7 19l1-1.4a10.4 10.4 0 0 1-1.6-.8l.4-.3a11.5 11.5 0 0 0 9.8 0l.4.3a10.4 10.4 0 0 1-1.6.8l1 1.4a16.2 16.2 0 0 0 4.8-1.8c.5-4.1-.6-7.7-1.6-10.8ZM8.5 14.9c-.9 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.7 2-1.7 2Zm7 0c-.9 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.7 2-1.7 2Z" />
  </svg>
);
