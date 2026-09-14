"use client";

import { useEffect, useRef, useState } from "react";

import { siteNameJp } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { CLIP, splitChars } from "@/lib/animations";
import { prefersReducedMotion } from "@/lib/media";
import { markReady } from "@/lib/ready";
import { useGsap } from "@/hooks/useGsap";
import { useLenis } from "./SmoothScroll";

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [lenis, done]);

  useGsap(rootRef, (root) => {
    const q = gsap.utils.selector(root);

    if (prefersReducedMotion()) {
      markReady();
      setDone(true);
      return;
    }

    window.scrollTo(0, 0);

    const counter = { value: 0 };
    const digits = q("[data-counter]")[0];
    const kanji = splitChars(q("[data-kanji]"));
    const panels = q("[data-panel]");

    const tl = gsap.timeline({ onComplete: () => setDone(true), defaults: { ease: "cinematic" } });

    tl.fromTo(
      kanji.chars,
      { autoAlpha: 0, yPercent: 30, filter: "blur(18px)", scale: 1.2 },
      { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", scale: 1, duration: 1.3, stagger: 0.09 },
      0.1
    )
      .fromTo(q("[data-meta]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.4)
      .fromTo(q("[data-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0.2)
      .to(
        counter,
        {
          value: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            if (digits) digits.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        },
        0.2
      )
      .to(kanji.chars, { yPercent: -40, autoAlpha: 0, filter: "blur(10px)", duration: 0.7, stagger: 0.04, ease: "power3.in" }, 2.15)
      .to(q("[data-meta], [data-bar-wrap]"), { autoAlpha: 0, duration: 0.4 }, 2.2)
      .call(markReady, [], 2.4)
      .to(panels[0], { clipPath: CLIP.fromTop, duration: 1.1, ease: "swift" }, 2.45)
      .to(panels[1], { clipPath: CLIP.fromBottom, duration: 1.1, ease: "swift" }, 2.5);

    return () => {
      tl.kill();
    };
  });

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden text-bone"
    >
      <div data-panel className="absolute inset-x-0 top-0 h-1/2 bg-ink">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-glow/40 to-transparent" />
      </div>
      <div data-panel className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[140px]" />

      <p
        data-kanji
        lang="ja"
        className="glow-text relative font-brush text-[clamp(3.5rem,14vw,9rem)] leading-none tracking-[0.06em]"
      >
        {siteNameJp}
      </p>

      <div className="absolute inset-x-6 bottom-8 flex items-end justify-between lg:inset-x-12 lg:bottom-12">
        <div data-meta className="flex flex-col gap-2">
          <span className="eyebrow">Loading the archive</span>
          <span data-bar-wrap className="block h-px w-40 bg-line lg:w-64">
            <span data-bar className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-violet to-glow" />
          </span>
        </div>
        <span data-meta data-counter className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tabular-nums">
          000
        </span>
      </div>
    </div>
  );
}
