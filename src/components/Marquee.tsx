"use client";

import { useRef } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";
import { useGsap } from "@/hooks/useGsap";

type Props = {
  items: readonly string[];
  className?: string;
  speed?: number;
};

export function Marquee({ items, className = "", speed = 40 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsap(rootRef, (root) => {
    if (prefersReducedMotion()) return;

    const lanes = Array.from(root.querySelectorAll<HTMLElement>("[data-lane]"));
    const tweens = lanes.map((lane) =>
      gsap.to(lane, { xPercent: -50, duration: speed, ease: "none", repeat: -1 })
    );

    const scale = { value: 1 };
    const settle = gsap.quickTo(scale, "value", {
      duration: 0.8,
      ease: "power3",
      onUpdate: () => tweens.forEach((t) => t.timeScale(scale.value)),
    });

    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 260);
        settle(1 + Math.abs(v));
      },
      onLeave: () => tweens.forEach((t) => t.pause()),
      onEnterBack: () => tweens.forEach((t) => t.play()),
      onLeaveBack: () => tweens.forEach((t) => t.pause()),
      onEnter: () => tweens.forEach((t) => t.play()),
    });
  });

  const lane = [...items, ...items];

  return (
    <div ref={rootRef} aria-hidden className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div data-lane className="flex w-max items-center">
        {lane.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 font-display text-[clamp(1.6rem,4vw,3.4rem)] uppercase leading-none tracking-[0.08em] text-transparent [-webkit-text-stroke:1px_rgb(236_232_245/0.28)]">
              {item}
            </span>
            <span className="size-1.5 rounded-full bg-glow/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
