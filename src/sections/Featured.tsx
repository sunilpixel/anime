"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";

import { featured } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CLIP, fadeUp, magnetic, revealLines, scramble } from "@/lib/animations";
import { hasFinePointer, prefersReducedMotion, queries } from "@/lib/media";
import { useGsap } from "@/hooks/useGsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { Band } from "@/components/Band";
import { SectionRail } from "@/components/SectionRail";
import { scrollToTarget, useLenis } from "@/components/SmoothScroll";
import { ArrowLeft, ArrowRight } from "@/components/Icons";

type Arc = (typeof featured.cards)[number];

export function Featured() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const srcRect = useRef<DOMRect | null>(null);
  const sheetRef = useRef<HTMLSpanElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<Arc | null>(null);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => setMounted(true), []);

  useGsap(rootRef, (root) => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(
      { desktop: queries.desktop, mobile: queries.mobile, reduce: queries.reduce },
      (context) => {
        const { desktop, reduce } = context.conditions as Record<string, boolean>;
        if (reduce) return;

        const cards = q("[data-card]");
        const media = q("[data-card-media]");
        const track = q("[data-track]")[0] as HTMLElement | undefined;
        const cleanups: Array<() => void> = [];

        gsap.set(q("[data-copy]"), { autoAlpha: 0 });
        gsap.set(cards, { autoAlpha: 0, yPercent: 16, rotate: -4 });
        gsap.set(media, { clipPath: CLIP.fromBottom });
        gsap.set(q("[data-card-img]"), { scale: 1.3 });
        gsap.set(q("[data-card-label]"), { autoAlpha: 0, y: 16 });

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top 65%", once: true } })
          .add(revealLines(q("[data-title]"), { duration: 1.1, stagger: 0.1 }), 0)
          .to(cards, { autoAlpha: 1, yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.1 }, 0.15)
          .to(media, { clipPath: CLIP.full, duration: 1.5, stagger: 0.1, ease: "drift" }, 0.15)
          .to(q("[data-card-img]"), { scale: 1, duration: 2, stagger: 0.1, ease: "drift" }, 0.15)
          .to(q("[data-card-label]"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.7)
          .add(fadeUp(q("[data-copy]"), { duration: 1, stagger: 0.09 }), 0.5);

        cleanups.push(magnetic(q("[data-magnet]")));

        if (!desktop || !track) {
          gsap.to(q("[data-glow]"), {
            yPercent: -8,
            xPercent: 4,
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          });
          return () => cleanups.forEach((fn) => fn());
        }

        const viewport = track.parentElement as HTMLElement;
        const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const skew = cards.map((el) => gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" }));

        const pinned = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${travel() + window.innerHeight * 0.7}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const v = gsap.utils.clamp(-9, 9, self.getVelocity() / -240);
              skew.forEach((fn) => fn(v));
            },
          },
        });

        pinned
          .to(track, { x: () => -travel(), ease: "none" }, 0)
          .to(q("[data-card-img]"), { xPercent: 7, ease: "none" }, 0)
          .to(q("[data-glow]"), { xPercent: -34, ease: "none" }, 0)
          .fromTo(q("[data-ghost]"), { xPercent: 10 }, { xPercent: -30, ease: "none" }, 0)
          .fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);

        cards.forEach((card) => {
          const lines = Array.from(card.querySelectorAll<HTMLElement>("[data-scramble]"));
          const words = lines.map((l) => l.textContent ?? "");

          ScrollTrigger.create({
            trigger: card,
            containerAnimation: pinned,
            start: "left 78%",
            end: "right 22%",
            toggleClass: { targets: card, className: "is-active" },
            onEnter: () => {
              lines.forEach((line, i) => scramble(line, words[i], { duration: 0.7 }));
              gsap.fromTo(
                card.querySelector("[data-rule]"),
                { scaleX: 0 },
                { scaleX: 1, duration: 0.8, ease: "swift" }
              );
            },
          });
        });

        ScrollTrigger.refresh();

        if (hasFinePointer()) {
          const tilt = cards.map((el) => ({
            rx: gsap.quickTo(el, "rotationX", { duration: 0.9, ease: "power3" }),
            ry: gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power3" }),
          }));

          const onMove = (e: globalThis.PointerEvent) => {
            const dy = e.clientY / window.innerHeight - 0.5;
            cards.forEach((el, i) => {
              const r = el.getBoundingClientRect();
              const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
              tilt[i].ry(gsap.utils.clamp(-16, 16, dx * 26));
              tilt[i].rx(-dy * 9);
            });
          };

          window.addEventListener("pointermove", onMove, { passive: true });
          cleanups.push(() => window.removeEventListener("pointermove", onMove));
        }

        return () => cleanups.forEach((fn) => fn());
      }
    );

    return () => mm.revert();
  });

  useIsomorphicLayoutEffect(() => {
    const el = sheetRef.current;
    const from = srcRect.current;
    if (!open || !el || !from) return;

    if (prefersReducedMotion()) {
      gsap.set("[data-sheet-line]", { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: "transform" });
    const to = el.getBoundingClientRect();

    gsap.fromTo(
      el,
      {
        x: from.left - to.left,
        y: from.top - to.top,
        scaleX: from.width / to.width,
        scaleY: from.height / to.height,
        transformOrigin: "top left",
      },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1.15, ease: "power3.inOut" }
    );

    gsap.fromTo(
      "[data-sheet-line]",
      { autoAlpha: 0, y: 26 },
      { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, delay: 0.3 }
    );

    gsap.fromTo("[data-sheet-veil]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });
  }, [open]);

  useEffect(() => {
    if (!open) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const openSheet = (arc: Arc) => (e: MouseEvent<HTMLButtonElement>) => {
    opener.current = e.currentTarget;
    srcRect.current = e.currentTarget.getBoundingClientRect();
    setOpen(arc);
  };

  const closeSheet = () => {
    const el = sheetRef.current;
    const back = srcRect.current;

    const finish = () => {
      setOpen(null);
      opener.current?.focus();
    };

    if (!el || !back || prefersReducedMotion()) return finish();

    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: "transform" });
    const to = el.getBoundingClientRect();
    gsap.to("[data-sheet-line], [data-sheet-veil]", { autoAlpha: 0, duration: 0.25 });
    gsap.to(el, {
      x: back.left - to.left,
      y: back.top - to.top,
      scaleX: back.width / to.width,
      scaleY: back.height / to.height,
      transformOrigin: "top left",
      duration: 0.7,
      ease: "power3.inOut",
      onComplete: finish,
    });
  };

  const nudge = (dir: -1 | 1) => () => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 220) + 12), behavior: "smooth" });
  };

  const go = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget(lenis, href);
  };

  const stopTilt = (e: PointerEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 0.6 });
  };

  return (
    <section
      id="featured"
      ref={rootRef}
      className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-ink lg:h-screen lg:min-h-0"
      aria-labelledby="featured-title"
    >
      <Band className="bg-abyss/90">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_45%,rgb(76_63_179/0.26),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-glow/25 to-transparent" />
      </Band>

      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute left-[52%] top-[6%] size-[46vw] rounded-full bg-violet/20 blur-[150px]"
      />

      <span
        data-ghost
        aria-hidden
        className="text-outline pointer-events-none absolute bottom-[4%] left-[20%] z-[1] hidden select-none whitespace-nowrap font-display text-[22vw] uppercase leading-none lg:block"
      >
        {featured.ghost}
      </span>

      <SectionRail id="featured" jpClassName="top-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-10 pb-20 pt-44 lg:grid lg:grid-cols-[24vw_1fr] lg:items-center lg:gap-0 lg:py-0 lg:pl-[8vw]">
        <div className="px-6 lg:px-0">
          <h2
            id="featured-title"
            data-title
            className="font-display text-[clamp(1.9rem,7vw,2.5rem)] uppercase leading-[1.14] tracking-[0.04em] text-bone lg:text-[clamp(1.9rem,2.6vw,3rem)]"
          >
            {featured.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <div data-copy className="mt-8 flex items-center gap-5 lg:mt-10">
            <p className="max-w-[12rem] text-[0.66rem] uppercase leading-[1.7] tracking-[0.18em] text-ash">
              {featured.caption}
            </p>
            <a
              href={featured.cta.href}
              onClick={go(featured.cta.href)}
              aria-label={featured.cta.label}
              data-magnet
              data-cursor="Go"
              className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-mist transition-[border-color,color] duration-500 hover:border-glow/60 hover:text-bone"
            >
              <ArrowRight width={15} height={15} />
            </a>
          </div>
        </div>

        <div className="lg:overflow-hidden lg:pl-[1vw] lg:pr-[13vw]">
          <ul
            ref={scrollerRef}
            data-track
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-6 px-6 pb-4 [scrollbar-width:none] lg:w-max lg:snap-none lg:gap-[1vw] lg:overflow-visible lg:px-0 lg:pb-0 lg:[perspective:1500px] lg:[rotate:2.4deg] lg:[transform-origin:left_center] [&::-webkit-scrollbar]:hidden"
          >
            {featured.cards.map((card, i) => (
              <li
                key={card.id}
                className="w-[58vw] shrink-0 snap-start sm:w-[38vw] lg:w-[17.5vw] lg:[transform:translateY(calc(var(--i)*0.45vw))]"
                style={{ "--i": i } as CSSProperties}
              >
                <article
                  data-card
                  onPointerLeave={stopTilt}
                  className="group/card [transform-style:preserve-3d] will-change-transform"
                >
                  <button
                    type="button"
                    onClick={openSheet(card)}
                    aria-label={`Open ${card.title.join(" ")}`}
                    data-cursor="Open"
                    data-card-media
                    className="relative block aspect-[0.62] w-full overflow-hidden border border-line transition-[border-color,box-shadow] duration-700 group-hover/card:border-glow/60 group-hover/card:shadow-[0_0_60px_rgb(139_92_246/0.35)]"
                  >
                    <span
                      data-card-img
                      className="absolute inset-[-6%] block origin-center"
                    >
                      <Image
                        src={card.image.src}
                        alt={card.image.alt}
                        fill
                        sizes="(min-width: 1024px) 18vw, (min-width: 640px) 38vw, 58vw"
                        quality={80}
                        className="object-cover object-[50%_30%] transition-transform duration-[900ms] ease-cinematic group-hover/card:scale-[1.05]"
                      />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                    <span className="absolute inset-0 bg-violet/0 transition-colors duration-500 group-hover/card:bg-violet/10" />
                  </button>

                  <div data-card-label className="mt-4">
                    <h3 className="text-[0.76rem] uppercase leading-[1.5] tracking-[0.16em] text-bone">
                      {card.title.map((line) => (
                        <span key={line} data-scramble className="block">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <span
                      data-rule
                      className="mt-3 block h-px w-6 origin-left bg-line transition-colors duration-500 group-hover/card:bg-glow/70"
                    />
                    <span className="mt-2 block text-[0.64rem] tracking-[0.22em] text-ash">
                      {card.index}
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute inset-x-[8vw] bottom-10 z-20 hidden items-center gap-6 lg:flex">
        <span className="h-px flex-1 bg-line">
          <span
            data-progress
            className="block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-violet to-glow"
          />
        </span>
        <div className="flex gap-3">
          {([["Previous arc", -1], ["Next arc", 1]] as const).map(([label, dir]) => (
            <button
              key={label}
              type="button"
              onClick={nudge(dir)}
              aria-label={label}
              data-magnet
              className="grid size-10 place-items-center rounded-full border border-line text-mist transition-[border-color,color] duration-500 hover:border-glow/60 hover:text-bone"
            >
              {dir === -1 ? <ArrowLeft width={14} height={14} /> : <ArrowRight width={14} height={14} />}
            </button>
          ))}
        </div>
      </div>

      {mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={open ? open.title.join(" ") : undefined}
            className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
          >
            <button
              type="button"
              onClick={closeSheet}
              tabIndex={open ? 0 : -1}
              aria-label="Close arc detail"
              data-sheet-veil
              className={`absolute inset-0 bg-ink/85 backdrop-blur-xl ${open ? "" : "opacity-0"}`}
            />

            {open && (
              <div className="relative mx-auto flex h-full max-w-[1500px] flex-col items-center justify-center gap-10 px-6 py-20 lg:flex-row lg:gap-16 lg:px-[8vw]">
                <span
                  ref={sheetRef}
                  data-sheet-media
                  className="relative block aspect-[0.62] w-[58vw] max-w-[20rem] shrink-0 overflow-hidden border border-glow/40 shadow-[0_0_90px_rgb(139_92_246/0.35)] lg:w-[24vw] lg:max-w-none"
                >
                  <Image
                    src={open.image.src}
                    alt={open.image.alt}
                    fill
                    sizes="(min-width: 1024px) 24vw, 58vw"
                    quality={90}
                    className="object-cover object-[50%_30%]"
                  />
                </span>

                <div className="max-w-xl">
                  <span data-sheet-line className="eyebrow block text-lilac">
                    Arc {open.index}
                  </span>
                  <h3
                    data-sheet-line
                    className="mt-4 font-display text-[clamp(2rem,5vw,3.6rem)] uppercase leading-[1.05] tracking-[0.03em] text-bone"
                  >
                    {open.title.join(" ")}
                  </h3>
                  <p
                    data-sheet-line
                    className="mt-6 max-w-[32rem] text-[0.95rem] font-light leading-[1.75] text-mist"
                  >
                    {open.blurb}
                  </p>
                  <button
                    data-sheet-line
                    type="button"
                    onClick={closeSheet}
                    className="mt-10 inline-flex items-center gap-3 rounded-full border border-line py-2.5 pl-6 pr-3 text-[0.72rem] uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:border-glow/60"
                  >
                    Close
                    <span className="grid size-8 place-items-center rounded-full border border-line">
                      <ArrowLeft width={13} height={13} />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </section>
  );
}
