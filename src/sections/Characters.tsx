"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";

import { characters } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CLIP, pointerParallax, riseChars, scramble } from "@/lib/animations";
import { prefersReducedMotion, queries } from "@/lib/media";
import { useGsap } from "@/hooks/useGsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { Band } from "@/components/Band";
import { SectionRail } from "@/components/SectionRail";
import { PillLink } from "@/components/PillLink";

const roster = characters.roster;

const WIPE_IN = "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)";
const WIPE_FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

export function Characters() {
  const rootRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const dirRef = useRef(1);
  const pinRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useGsap(rootRef, (root) => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    const paint = (next: number, previous: number) => {
      const plates = q("[data-plate]");
      const instant = prefersReducedMotion();
      const dir = next > previous ? 1 : -1;

      gsap.to(plates[previous], {
        autoAlpha: 0,
        scale: 1.08,
        xPercent: -4 * dir,
        duration: instant ? 0 : 0.9,
        ease: "power2.inOut",
      });

      gsap.fromTo(
        plates[next],
        { autoAlpha: 1, scale: 1.16, xPercent: 5 * dir, clipPath: WIPE_IN },
        { scale: 1, xPercent: 0, clipPath: WIPE_FULL, duration: instant ? 0 : 1.3, ease: "power3.inOut" }
      );

      gsap.fromTo(
        q("[data-flash]"),
        { autoAlpha: 0.55 },
        { autoAlpha: 0, duration: instant ? 0 : 0.9, ease: "power2.out" }
      );

      gsap.to(root, { "--tint": roster[next].tint, duration: instant ? 0 : 1.1, ease: "power2.inOut" });
    };

    const select = (i: number) => {
      const clamped = gsap.utils.clamp(0, roster.length - 1, i);
      if (clamped === activeRef.current) return;
      const prev = activeRef.current;
      activeRef.current = clamped;
      dirRef.current = clamped > prev ? 1 : -1;
      setActive(clamped);
      paint(clamped, prev);
    };

    mm.add(
      { desktop: queries.desktop, mobile: queries.mobile, reduce: queries.reduce },
      (context) => {
        const { desktop, reduce } = context.conditions as Record<string, boolean>;

        gsap.set(q("[data-plate]"), { autoAlpha: 0, clipPath: WIPE_FULL });
        gsap.set(q("[data-plate]")[activeRef.current], { autoAlpha: 1 });

        if (reduce) return;

        gsap.set(q("[data-intro]"), { autoAlpha: 0, y: 28 });
        gsap.set(q("[data-thumb]"), { autoAlpha: 0, x: 24 });
        gsap.set(q("[data-frame]"), { scaleY: 0 });

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top 70%", once: true } })
          .to(q("[data-intro]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0)
          .to(q("[data-thumb]"), { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.07 }, 0.3)
          .to(q("[data-frame]"), { scaleY: 1, duration: 1.4, ease: "drift" }, 0.2)
          .fromTo(
            q("[data-plate]")[activeRef.current],
            { clipPath: CLIP.fromBottom, scale: 1.16 },
            { clipPath: WIPE_FULL, scale: 1, duration: 1.6, ease: "drift" },
            0
          )
          .fromTo(
            q("[data-kanji-bg]"),
            { autoAlpha: 0, yPercent: 10 },
            { autoAlpha: 1, yPercent: 0, duration: 1.6 },
            0.4
          );

        const cleanups: Array<() => void> = [];

        if (desktop) {
          const span = () => `+=${window.innerHeight * (roster.length - 1) * 0.8}`;
          const st = ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: span,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: { snapTo: 1 / (roster.length - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" },
            onUpdate: (self) => select(Math.round(self.progress * (roster.length - 1))),
          });
          pinRef.current = st;
          cleanups.push(() => {
            pinRef.current = null;
            st.kill();
          });

          gsap.fromTo(
            q("[data-progress]"),
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: span, scrub: true } }
          );
        }

        cleanups.push(pointerParallax(q("[data-parallax]")));

        return () => cleanups.forEach((fn) => fn());
      }
    );

    const onSelect = ((e: CustomEvent<number>) => {
      const st = pinRef.current;
      if (st) {
        const span = st.end - st.start;
        window.scrollTo({
          top: st.start + (span * e.detail) / (roster.length - 1) + 4,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
        return;
      }
      select(e.detail);
    }) as EventListener;

    root.addEventListener("characterselect", onSelect);

    return () => {
      root.removeEventListener("characterselect", onSelect);
      mm.revert();
    };
  });

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const q = gsap.utils.selector(root);
    const dir = dirRef.current;
    const person = roster[active];

    const ctx = gsap.context(() => {
      riseChars(q("[data-name-line]"), { duration: 0.9, stagger: 0.035 });
      riseChars(q("[data-kanji-bg]"), { duration: 1.1, stagger: 0.08 });
      gsap.fromTo(
        q("[data-swap]"),
        { autoAlpha: 0, y: 26 * dir },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power3.out" }
      );
      scramble(q("[data-role]"), person.role);
      gsap.fromTo(q("[data-index]"), { yPercent: 40 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7 });
    }, root);

    return () => ctx.revert();
  }, [active]);

  const choose = (i: number) => () => {
    rootRef.current?.dispatchEvent(new CustomEvent("characterselect", { detail: i }));
  };

  const current = roster[active];

  return (
    <section
      id="characters"
      ref={rootRef}
      style={{ "--tint": roster[0].tint } as CSSProperties}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink lg:h-screen"
      aria-labelledby="characters-title"
    >
      <Band className="bg-abyss/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_38%_45%,rgb(var(--tint)/0.22),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-glow/25 to-transparent" />
      </Band>

      <div
        data-parallax="18"
        aria-hidden
        className="pointer-events-none absolute left-[18%] top-[12%] size-[40vw] rounded-full blur-[150px]"
        style={{ background: "rgb(var(--tint) / 0.16)" }}
      />

      <span
        key={current.id}
        data-kanji-bg
        data-parallax="-10"
        lang="ja"
        aria-hidden
        className="text-outline-glow pointer-events-none absolute right-[6%] top-[8%] hidden select-none font-jp text-[clamp(8rem,20vw,22rem)] leading-none tracking-[0.06em] lg:block"
        style={{ WebkitTextStrokeColor: "rgb(var(--tint) / 0.4)" }}
      >
        {current.nameJp.replace(" ", "")}
      </span>

      <SectionRail id="characters" jpClassName="top-1/2 -translate-y-1/2" />

      <div className="relative z-10 grid flex-1 grid-cols-1 items-center gap-10 px-6 pb-16 pt-44 lg:grid-cols-[30vw_1fr_auto] lg:gap-[3vw] lg:px-[8vw] lg:pb-0 lg:pt-0">
        <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-none">
          <span
            data-frame
            aria-hidden
            className="pointer-events-none absolute -left-4 -top-4 h-[calc(100%+2rem)] w-px origin-top bg-gradient-to-b from-transparent via-glow/50 to-transparent"
          />
          <span
            data-index
            aria-hidden
            className="pointer-events-none absolute -right-7 top-0 z-20 hidden font-display text-[0.8rem] tracking-[0.3em] text-mist lg:block"
            style={{ writingMode: "vertical-rl" }}
          >
            {String(active + 1).padStart(2, "0")} / {String(roster.length).padStart(2, "0")}
          </span>

          <div data-parallax="-22" className="relative aspect-[0.8] w-full lg:aspect-[0.68]">
            {roster.map((person) => (
              <div key={person.id} data-plate className="absolute inset-0 origin-center overflow-hidden">
                <Image
                  src={person.portrait.src}
                  alt={person.portrait.alt}
                  fill
                  quality={90}
                  sizes="(min-width: 1024px) 30vw, 88vw"
                  className="object-cover"
                  style={{ objectPosition: person.focus }}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
                <span
                  className="absolute inset-0 mix-blend-soft-light"
                  style={{ background: "rgb(var(--tint) / 0.3)" }}
                />
              </div>
            ))}
            <span
              data-flash
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
              style={{ background: "rgb(var(--tint))" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-px border border-line"
              style={{ boxShadow: "0 0 90px rgb(var(--tint) / 0.28)" }}
            />
          </div>

          <div className="mt-6 lg:absolute lg:-bottom-4 lg:left-6 lg:mt-0">
            <p key={current.id} className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[0.98] tracking-[0.04em] text-bone">
              {current.name.map((line) => (
                <span key={line} data-name-line className="block">
                  {line}
                </span>
              ))}
            </p>
            <p data-swap lang="ja" className="mt-2 font-jp text-[0.9rem] tracking-[0.34em] text-mist">
              {current.nameJp}
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <h2
            id="characters-title"
            data-intro
            className="font-display text-[clamp(2.1rem,8vw,3rem)] uppercase leading-none tracking-[0.03em] text-bone lg:whitespace-nowrap lg:text-[clamp(2.6rem,4.4vw,5rem)]"
          >
            {characters.title.lead}
            <span className="glow-text text-lilac">{characters.title.accent}</span>
          </h2>

          <p data-intro className="eyebrow mt-5">
            {characters.eyebrow}
          </p>

          <p
            key={current.id}
            data-role
            data-swap
            className="mt-8 text-[0.7rem] uppercase tracking-[0.24em]"
            style={{ color: "rgb(var(--tint))" }}
          >
            {current.role}
          </p>

          <p data-swap className="mt-4 max-w-[30rem] text-[0.95rem] font-light leading-[1.75] text-mist">
            {current.description}
          </p>

          <div data-intro className="mt-10">
            <PillLink href={characters.cta.href} label={characters.cta.label} />
          </div>
        </div>

        <div className="flex items-stretch gap-5">
          <span className="relative hidden w-px bg-line lg:block">
            <span data-progress className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-violet to-glow" />
          </span>
          <ul
            role="tablist"
            aria-label="Characters"
            aria-orientation="vertical"
            className="scrollbar-none -mx-6 flex gap-3 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {roster.map((person, i) => (
              <li key={person.id} data-thumb className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={choose(i)}
                  data-cursor={person.name[0]}
                  className={`group relative block h-[5.6rem] w-[3.4rem] overflow-hidden border transition-[border-color,box-shadow,transform] duration-500 lg:h-[4.8rem] lg:w-[3rem] ${
                    i === active ? "scale-[1.12] border-glow/70" : "border-line opacity-55 hover:opacity-90"
                  }`}
                  style={i === active ? { boxShadow: "0 0 30px rgb(var(--tint) / 0.5)" } : undefined}
                >
                  <Image
                    src={person.portrait.src}
                    alt=""
                    fill
                    sizes="64px"
                    className={`object-cover transition-[filter] duration-500 ${i === active ? "grayscale-0" : "grayscale"}`}
                    style={{ objectPosition: person.focus }}
                  />
                  <span className="sr-only">{person.name.join(" ")}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
    </section>
  );
}
