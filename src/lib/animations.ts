import { gsap, SplitText } from "./gsap";
import { hasFinePointer } from "./media";

export const CLIP = {
  full: "inset(0% 0% 0% 0%)",
  fromRight: "inset(0% 0% 0% 100%)",
  fromLeft: "inset(0% 100% 0% 0%)",
  fromBottom: "inset(100% 0% 0% 0%)",
  fromTop: "inset(0% 0% 100% 0%)",
} as const;

export const splitLines = (target: gsap.DOMTarget) =>
  SplitText.create(target, { type: "lines", mask: "lines", linesClass: "split-line" });

export const splitChars = (target: gsap.DOMTarget) =>
  SplitText.create(target, { type: "chars", charsClass: "split-char" });

export const splitWords = (target: gsap.DOMTarget) =>
  SplitText.create(target, { type: "words", mask: "words", wordsClass: "split-word" });

export function revealLines(target: gsap.DOMTarget, vars: gsap.TweenVars = {}): gsap.core.Tween {
  const split = splitLines(target);
  return gsap.fromTo(
    split.lines,
    { yPercent: 110, rotate: 2 },
    { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.09, ...vars }
  );
}

export function revealChars(target: gsap.DOMTarget, vars: gsap.TweenVars = {}): gsap.core.Tween {
  const split = splitChars(target);
  return gsap.fromTo(
    split.chars,
    { autoAlpha: 0, scale: 1.35, filter: "blur(16px)" },
    { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.4, stagger: 0.16, ...vars }
  );
}

export function riseChars(target: gsap.DOMTarget, vars: gsap.TweenVars = {}): gsap.core.Tween {
  const split = SplitText.create(target, { type: "chars", mask: "chars", charsClass: "split-char" });
  return gsap.fromTo(
    split.chars,
    { yPercent: 120, rotate: 6 },
    { yPercent: 0, rotate: 0, duration: 1, stagger: { each: 0.03, from: "start" }, ...vars }
  );
}

export function fadeUp(target: gsap.DOMTarget, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return gsap.fromTo(
    target,
    { autoAlpha: 0, y: 18 },
    { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ...vars }
  );
}

export function clipReveal(
  target: gsap.DOMTarget,
  from: string = CLIP.fromRight,
  vars: gsap.TweenVars = {}
): gsap.core.Tween {
  return gsap.fromTo(
    target,
    { clipPath: from },
    { clipPath: CLIP.full, duration: 1.8, ease: "drift", ...vars }
  );
}

export function scramble(target: gsap.DOMTarget, text: string, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return gsap.to(target, {
    duration: 0.8,
    ease: "none",
    scrambleText: { text, chars: "upperCase", speed: 0.6 },
    ...vars,
  });
}

export function pointerParallax(layers: HTMLElement[], scope: Window | HTMLElement = window) {
  if (!hasFinePointer() || !layers.length) return () => {};

  const tracked = layers.map((el) => ({
    depth: Number(el.dataset.parallax),
    xTo: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3" }),
    yTo: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3" }),
  }));

  const onMove = (e: Event) => {
    const p = e as PointerEvent;
    const dx = p.clientX / window.innerWidth - 0.5;
    const dy = p.clientY / window.innerHeight - 0.5;
    tracked.forEach(({ depth, xTo, yTo }) => {
      xTo(dx * depth);
      yTo(dy * depth);
    });
  };

  scope.addEventListener("pointermove", onMove, { passive: true });
  return () => scope.removeEventListener("pointermove", onMove);
}

export function magnetic(elements: HTMLElement[], strength = 0.45) {
  if (!hasFinePointer() || !elements.length) return () => {};

  const cleanups = elements.map((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });
    const move = (e: Event) => {
      const p = e as PointerEvent;
      const r = el.getBoundingClientRect();
      xTo((p.clientX - (r.left + r.width / 2)) * strength);
      yTo((p.clientY - (r.top + r.height / 2)) * strength);
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
    };
  });

  return () => cleanups.forEach((fn) => fn());
}

export function driftLoop(elements: HTMLElement[], amplitude = 40) {
  elements.forEach((el, i) => {
    gsap.to(el, {
      x: amplitude + i * 30,
      y: -amplitude - i * 20,
      scale: 1.12,
      duration: 10 + i * 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  });
}

