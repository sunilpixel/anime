"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { episodes } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { revealLines, scramble } from "@/lib/animations";
import { prefersReducedMotion, queries } from "@/lib/media";
import { useGsap } from "@/hooks/useGsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SectionRail } from "@/components/SectionRail";
import { PillLink } from "@/components/PillLink";
import { Play } from "@/components/Icons";

const stops = episodes.timeline;

const WIPES = [
  {
    from: "polygon(100% 0%, 120% 0%, 120% 100%, 80% 100%)",
    to: "polygon(-25% 0%, 100% 0%, 100% 100%, -25% 100%)",
  },
  {
    from: "inset(100% 0% 0% 0%)",
    to: "inset(0% 0% 0% 0%)",
  },
  {
    from: "circle(0% at 64% 52%)",
    to: "circle(110% at 64% 52%)",
  },
  {
    from: "inset(0% 0% 0% 100%)",
    to: "inset(0% 0% 0% 0%)",
  },
];

export function Episodes() {
  const rootRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const pinRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useGsap(rootRef, (root) => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(
      { desktop: queries.desktop, mobile: queries.mobile, reduce: queries.reduce },
      (context) => {
        const { desktop, reduce } = context.conditions as Record<string, boolean>;
        if (reduce) return;

        const slides = q("[data-slide]");

        gsap.set(q("[data-intro]"), { autoAlpha: 0, y: 26 });
        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top 70%", once: true } })
          .add(revealLines(q("[data-title]"), { duration: 1.1, stagger: 0.1 }), 0)
          .to(q("[data-intro]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.2);

        if (!desktop) {
          slides.forEach((slide, i) => {
            ScrollTrigger.create({
              trigger: slide,
              start: "top 55%",
              end: "bottom 55%",
              onToggle: (self) => {
                if (!self.isActive) return;
                activeRef.current = i;
                setActive(i);
              },
            });
            gsap.fromTo(
              slide.querySelector("[data-slide-img]"),
              { yPercent: -8, scale: 1.15 },
              {
                yPercent: 8,
                scale: 1,
                ease: "none",
                scrollTrigger: { trigger: slide, start: "top bottom", end: "bottom top", scrub: true },
              }
            );
            gsap.from(slide.querySelectorAll("[data-slide-copy]"), {
              autoAlpha: 0,
              y: 30,
              stagger: 0.08,
              scrollTrigger: { trigger: slide, start: "top 60%", once: true },
            });
          });
          return;
        }

        slides.forEach((slide, i) => {
          if (i === 0) return;
          gsap.set(slide, { clipPath: WIPES[(i - 1) % WIPES.length].from });
        });

        const numbers = q("[data-number]");
        const rail = q("[data-numbers]")[0];
        const offset = (i: number) => {
          const n = numbers[i];
          return root.clientWidth * 0.7 - (n.offsetLeft + n.offsetWidth / 2);
        };

        gsap.set(rail, { x: offset(0) });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * (stops.length - 1) * 1.15}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = Math.min(stops.length - 1, Math.floor(self.progress * (stops.length - 1) + 0.5));
              if (next === activeRef.current) return;
              activeRef.current = next;
              setActive(next);
            },
          },
        });
        pinRef.current = timeline.scrollTrigger ?? null;

        slides.forEach((slide, i) => {
          if (i === 0) return;
          const wipe = WIPES[(i - 1) % WIPES.length];
          const at = i - 1;

          timeline
            .fromTo(slide, { clipPath: wipe.from }, { clipPath: wipe.to, ease: "none", duration: 1 }, at)
            .fromTo(slide.querySelector("[data-slide-img]"), { scale: 1.24 }, { scale: 1, ease: "none", duration: 1 }, at)
            .to(slides[i - 1].querySelector("[data-slide-img]"), { scale: 0.94, xPercent: -4, ease: "none", duration: 1 }, at)
            .to(slides[i - 1].querySelectorAll("[data-slide-copy]"), { autoAlpha: 0, y: -40, ease: "none", duration: 0.35 }, at)
            .fromTo(
              slide.querySelectorAll("[data-slide-copy]"),
              { autoAlpha: 0, y: 46 },
              { autoAlpha: 1, y: 0, ease: "none", duration: 0.45, stagger: 0.05 },
              at + 0.5
            )
            .to(rail, { x: () => offset(i), ease: "none", duration: 1 }, at);
        });

        timeline.fromTo(q("[data-rail-fill]"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: stops.length - 1 }, 0);

        ScrollTrigger.refresh();

        return () => {
          pinRef.current = null;
        };
      }
    );

    return () => mm.revert();
  });

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      scramble("[data-active-label]", stops[active].label, { duration: 0.6 });
      gsap.fromTo("[data-active-count]", { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6 });
    }, root);
    return () => ctx.revert();
  }, [active]);

  const jump = (i: number) => () => {
    const st = pinRef.current;
    if (!st) {
      const el = rootRef.current?.querySelectorAll<HTMLElement>("[data-slide]")[i];
      el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
      return;
    }
    window.scrollTo({
      top: st.start + ((st.end - st.start) * i) / (stops.length - 1) + 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="episodes"
      ref={rootRef}
      className="relative isolate bg-ink lg:h-screen lg:overflow-hidden"
      aria-labelledby="episodes-title"
    >
      <div className="relative lg:absolute lg:inset-0">
        {stops.map((stop, i) => (
          <article
            key={stop.id}
            data-slide
            style={{ zIndex: i }}
            className="relative h-[92svh] w-full overflow-hidden lg:absolute lg:inset-0 lg:h-auto"
          >
            <div data-slide-img className="absolute inset-[-6%] origin-center">
              <Image
                src={stop.image.src}
                alt={stop.image.alt}
                fill
                quality={80}
                sizes="100vw"
                className="object-cover object-center contrast-[1.06]"
              />
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_45%,transparent_2%,rgb(7_6_12/0.55)_58%,var(--color-ink)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--color-ink)_0%,rgb(7_6_12/0.88)_26%,rgb(7_6_12/0.3)_52%,transparent_74%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
            <div className="absolute inset-y-0 right-0 hidden w-[45%] bg-gradient-to-l from-ink/85 via-ink/40 to-transparent lg:block" />

            <div className="absolute inset-x-6 bottom-28 lg:inset-x-auto lg:bottom-auto lg:left-[8vw] lg:top-1/2 lg:max-w-[34vw] lg:-translate-y-1/2">
              <div data-slide-copy className="flex items-center gap-4">
                <span className="text-[0.68rem] uppercase tracking-[0.24em] text-lilac">{stop.label}</span>
                <span className="h-px w-10 bg-glow/50" />
                <span className="text-[0.68rem] tracking-[0.2em] text-ash">{stop.duration}</span>
              </div>

              <h3
                data-slide-copy
                className="mt-5 font-display text-[clamp(2rem,6vw,3.4rem)] leading-[1.04] tracking-[0.02em] text-bone"
              >
                {stop.title}
              </h3>

              <p data-slide-copy className="mt-5 max-w-[26rem] text-[0.95rem] font-light leading-[1.75] text-mist">
                {stop.synopsis}
              </p>

              <button
                data-slide-copy
                type="button"
                data-cursor="Play"
                aria-label={`Play ${stop.label} — ${stop.title}`}
                className="glass group mt-9 inline-flex items-center gap-4 rounded-full py-2 pl-2 pr-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-bone transition-[border-color,box-shadow] duration-500 hover:border-glow/60 hover:shadow-[0_0_40px_rgb(139_92_246/0.3)]"
              >
                <span className="grid size-11 place-items-center rounded-full bg-bone text-ink transition-transform duration-500 group-hover:scale-105">
                  <Play width={14} height={14} className="ml-0.5" />
                </span>
                Play episode
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
        <div className="absolute right-[9vw] top-[22%] text-right">
          <h2
            id="episodes-title"
            data-title
            className="font-display text-[clamp(2.2rem,3vw,3.4rem)] uppercase leading-[1.08] tracking-[0.03em] text-bone"
          >
            {episodes.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p data-intro className="mt-6 text-[0.66rem] uppercase leading-[1.8] tracking-[0.18em] text-ash">
            {episodes.caption.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <div data-intro className="pointer-events-auto mt-8 flex justify-end">
            <PillLink href={episodes.cta.href} label={episodes.cta.label} />
          </div>
        </div>

        <div className="mask-fade-x absolute inset-x-0 bottom-[9.5rem] overflow-hidden">
          <div data-numbers className="flex w-max items-end">
            {stops.map((stop, i) => (
              <span
                key={stop.id}
                data-number
                className={`font-display text-[11vw] leading-none tracking-[-0.02em] transition-[color,-webkit-text-stroke-color] duration-700 ${
                  i === active ? "glow-text text-bone" : "text-outline"
                }`}
                style={{ marginRight: "10vw" }}
              >
                {stop.number}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-30 mx-6 mb-10 lg:absolute lg:inset-x-[8vw] lg:bottom-10 lg:mx-0 lg:mb-0">
        <div className="flex items-center gap-6">
          <span data-active-count className="hidden font-display text-[0.8rem] tracking-[0.3em] text-bone lg:block">
            {String(active + 1).padStart(2, "0")}
            <span className="mx-1.5 text-ash">/</span>
            <span className="text-ash">{String(stops.length).padStart(2, "0")}</span>
          </span>
          <span className="relative h-px flex-1 bg-line">
            <span
              data-rail-fill
              className="absolute inset-0 block origin-left scale-x-0 bg-gradient-to-r from-violet to-glow"
            />
            <span className="absolute inset-x-0 -top-1 flex justify-between">
              {stops.map((stop, i) => (
                <button
                  key={stop.id}
                  type="button"
                  onClick={jump(i)}
                  aria-label={`Go to ${stop.label}`}
                  aria-current={i === active}
                  className={`size-2 rounded-full transition-[background-color,transform] duration-500 ${
                    i <= active ? "scale-125 bg-glow" : "bg-ash/50"
                  }`}
                />
              ))}
            </span>
          </span>
          <span key={active} data-active-label className="min-w-[4.5rem] text-right text-[0.66rem] tracking-[0.22em] text-ash">
            {stops[active].label}
          </span>
        </div>
      </div>

      <SectionRail id="episodes" jpClassName="top-1/2 -translate-y-1/2" />
    </section>
  );
}
