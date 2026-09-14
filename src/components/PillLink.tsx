"use client";

import type { MouseEvent } from "react";

import { ArrowRight } from "./Icons";
import { scrollToTarget, useLenis } from "./SmoothScroll";

type Props = {
  href: string;
  label: string;
  className?: string;
};

export function PillLink({ href, label, className = "" }: Props) {
  const lenis = useLenis();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    scrollToTarget(lenis, href);
  };

  return (
    <a
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center gap-4 rounded-full border border-line py-2 pl-7 pr-2 text-[0.8rem] tracking-[0.08em] text-bone transition-[border-color,box-shadow] duration-500 hover:border-glow/60 hover:shadow-[0_0_36px_rgb(139_92_246/0.25)] ${className}`}
    >
      {label}
      <span className="grid size-9 place-items-center rounded-full border border-line text-mist transition-[transform,color,border-color] duration-500 group-hover:translate-x-0.5 group-hover:border-glow/50 group-hover:text-bone">
        <ArrowRight width={14} height={14} />
      </span>
    </a>
  );
}
