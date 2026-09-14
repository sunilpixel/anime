"use client";

import { useRef } from "react";

import { gsap } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/media";
import { useGsap } from "@/hooks/useGsap";

const INTERACTIVE = "a, button, [role='tab'], [data-cursor]";

export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsap(rootRef, (root) => {
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const dot = root.querySelector<HTMLElement>("[data-dot]")!;
    const ring = root.querySelector<HTMLElement>("[data-ring]")!;
    const label = root.querySelector<HTMLElement>("[data-label]")!;

    document.documentElement.classList.add("has-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    let shown = false;

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(root, { autoAlpha: 1, duration: 0.4 });
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(INTERACTIVE);
      const text = target?.dataset.cursor ?? "";
      label.textContent = text;
      root.dataset.state = target ? (text ? "label" : "hover") : "idle";
    };

    const onLeave = () => gsap.to(root, { autoAlpha: 0, duration: 0.3 });
    const onEnter = () => gsap.to(root, { autoAlpha: 1, duration: 0.3 });
    const onDown = () => (root.dataset.pressed = "true");
    const onUp = () => delete root.dataset.pressed;

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  });

  return (
    <div ref={rootRef} data-state="idle" aria-hidden className="cursor">
      <span data-dot className="cursor-dot" />
      <span data-ring className="cursor-ring">
        <span data-label className="cursor-label" />
      </span>
    </div>
  );
}
