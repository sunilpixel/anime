"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/media";

type Props = {
  count?: number;
  color?: string;
  speed?: number;
  className?: string;
};

type Mote = {
  x: number;
  y: number;
  r: number;
  vy: number;
  wobble: number;
  phase: number;
  alpha: number;
};

export function Particles({ count = 60, color = "167 139 250", speed = 1, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let running = false;
    let last = 0;

    const sprite = document.createElement("canvas");
    const size = 64;
    sprite.width = size;
    sprite.height = size;
    const sctx = sprite.getContext("2d")!;
    const grad = sctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `rgb(${color} / 1)`);
    grad.addColorStop(0.25, `rgb(${color} / 0.55)`);
    grad.addColorStop(1, `rgb(${color} / 0)`);
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, size, size);

    const seed = (): Mote => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 4,
      vy: (10 + Math.random() * 26) * speed,
      wobble: 8 + Math.random() * 24,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.6,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: count }, seed);
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      const t = now / 1000;

      for (const m of motes) {
        m.y -= m.vy * dt;
        const x = m.x + Math.sin(t * 0.6 + m.phase) * m.wobble;
        const edge = Math.min(1, m.y / 80, (height - m.y) / 80);
        const twinkle = 0.7 + 0.3 * Math.sin(t * 1.4 + m.phase * 2);
        ctx.globalAlpha = Math.max(0, m.alpha * edge * twinkle);
        const d = m.r * 6;
        ctx.drawImage(sprite, x - d / 2, m.y - d / 2, d, d);
        if (m.y < -20) {
          m.y = height + 20;
          m.x = Math.random() * width;
        }
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      rootMargin: "10%",
    });
    const ro = new ResizeObserver(resize);

    resize();
    io.observe(canvas);
    ro.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, color, speed]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
