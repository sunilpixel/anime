"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { world } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { CLIP, pointerParallax, revealLines, scramble } from "@/lib/animations";
import { prefersReducedMotion, queries } from "@/lib/media";
import { useGsap } from "@/hooks/useGsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { Band } from "@/components/Band";
import { Particles } from "@/components/Particles";
import { SectionRail } from "@/components/SectionRail";
import { PillLink } from "@/components/PillLink";

const places = world.places;

export function World() {
  const rootRef = useRef<HTMLElement>(null);
  const activeRef = useRef(-1);
  const [active, setActive] = useState(-1);

  useGsap(rootRef, (root) => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    const show = (next: number) => {
      const prev = activeRef.current;
      if (next === prev) return;
      activeRef.current = next;
      setActive(next);

      const instant = prefersReducedMotion();
      const plates = q("[data-place-plate]");
      const base = q("[data-sky]")[0];

      if (prev >= 0) {
        gsap.to(plates[prev], { autoAlpha: 0, scale: 1.08, duration: instant ? 0 : 1, ease: "power2.inOut" });
      }
      gsap.fromTo(
        plates[next],
        { autoAlpha: 0, scale: 1.16 },
        { autoAlpha: 1, scale: 1.04, duration: instant ? 0 : 1.4, ease: "power3.inOut" }
      );
      gsap.to(base, { autoAlpha: 0.35, duration: instant ? 0 : 1.2 });
    };

    const onSelect = ((e: CustomEvent<number>) => show(e.detail)) as EventListener;
    root.addEventListener("placeselect", onSelect);

    mm.add(
      { desktop: queries.desktop, mobile: queries.mobile, reduce: queries.reduce },
      (context) => {
        const { desktop, reduce } = context.conditions as Record<string, boolean>;

        gsap.set(q("[data-place-plate]"), { autoAlpha: 0 });

        if (reduce) return;

        gsap.set(q("[data-intro]"), { autoAlpha: 0, y: 30 });
        gsap.set(q("[data-place]"), { autoAlpha: 0, x: 40 });
        gsap.set(q("[data-eclipse]"), { autoAlpha: 0, scale: 0.4 });

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top 72%", once: true } })
          .fromTo(
            q("[data-plates]"),
            { clipPath: CLIP.fromBottom, scale: 1.3 },
            { clipPath: CLIP.full, scale: 1, duration: 2.2, ease: "drift" },
            0
          )
          .to(q("[data-eclipse]"), { autoAlpha: 1, scale: 1, duration: 2.4, ease: "drift" }, 0.3)
          .add(revealLines(q("[data-line]"), { duration: 1.3, stagger: 0.14 }), 0.5)
          .to(q("[data-intro]"), { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.09 }, 1.1)
          .to(q("[data-place]"), { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.09 }, 1.2);

        const k = desktop ? 1 : 0.4;

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 } })
          .fromTo(q("[data-plates]"), { yPercent: -8 * k, scale: 1.22 }, { yPercent: 8 * k, scale: 1.02, ease: "none" }, 0)
          .fromTo(q("[data-eclipse]"), { yPercent: -30 * k }, { yPercent: 26 * k, ease: "none" }, 0)
          .fromTo(q("[data-ridge]"), { yPercent: 14 * k }, { yPercent: -12 * k, ease: "none" }, 0)
          .fromTo(q("[data-copy]"), { yPercent: 10 * k }, { yPercent: -14 * k, ease: "none" }, 0);

        return pointerParallax(q("[data-parallax]"));
      }
    );

    return () => {
      root.removeEventListener("placeselect", onSelect);
      mm.revert();
    };
  });

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || active < 0 || prefersReducedMotion()) return;
    const ctx = gsap.context(() => scramble("[data-place-label]", places[active].name, { duration: 0.6 }), root);
    return () => ctx.revert();
  }, [active]);

  const preview = (i: number) => () => {
    rootRef.current?.dispatchEvent(new CustomEvent("placeselect", { detail: i }));
  };

  return (
    <section
      id="world"
      ref={rootRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink lg:h-screen"
      aria-labelledby="world-title"
    >
      <Band className="bg-abyss">
        <div data-parallax="26" className="absolute inset-0">
          <div data-plates className="absolute inset-[-14%] origin-center">
            <div data-sky className="absolute inset-0">
              <Image
                src={world.background.src}
                alt={world.background.alt}
                fill
                quality={80}
                sizes="130vw"
                className="object-cover object-[50%_60%]"
              />
            </div>
            {places.map((place) => (
              <div key={place.id} data-place-plate className="absolute inset-0 origin-center">
                <Image
                  src={place.image.src}
                  alt={place.image.alt}
                  fill
                  quality={80}
                  sizes="130vw"
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>

        <div
          data-eclipse
          data-parallax="-34"
          aria-hidden
          className="absolute left-[46%] top-[6%] size-[40vw] rounded-full bg-[radial-gradient(circle,rgb(167_139_250/0.22),transparent_66%)] blur-[70px]"
        />

        <div
          data-ridge
          data-parallax="14"
          aria-hidden
          className="absolute inset-x-0 bottom-[-6%] h-[42%] bg-[linear-gradient(to_top,var(--color-ink)_18%,rgb(7_6_12/0.6)_58%,transparent_100%)]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_46%_44%,transparent_8%,rgb(7_6_12/0.5)_64%,var(--color-ink)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-glow/25 to-transparent" />
      </Band>

      <Particles count={70} speed={0.7} className="absolute inset-0 z-[5] h-full w-full" />

      <SectionRail id="world" jpClassName="top-1/2 -translate-y-1/2" />

      <div
        data-copy
        className="relative z-10 grid min-h-[100svh] grid-cols-1 items-center gap-12 px-6 pb-20 pt-44 lg:h-screen lg:min-h-0 lg:grid-cols-[1.05fr_0.95fr_auto] lg:gap-[4vw] lg:px-[8vw] lg:pb-0 lg:pt-0"
      >
        <h2 id="world-title" className="font-display uppercase leading-[0.94] tracking-[0.02em] text-bone">
          <span data-line className="block text-[clamp(1.4rem,4vw,2rem)] tracking-[0.22em]">
            The
          </span>
          <span data-line className="mt-2 block text-[clamp(2.8rem,9vw,5.6rem)]">
            World
          </span>
          <span data-line className="mt-1 block text-[clamp(2.8rem,9vw,5.6rem)]">
            <span className="mr-3 align-middle text-[0.42em] tracking-[0.2em] text-mist">of</span>
            <span className="glow-text text-lilac">{world.title.accent}</span>
          </span>
          <span data-intro aria-hidden className="mt-8 block h-px w-24 bg-glow/60" />
        </h2>

        <div>
          <p data-intro className="max-w-[26rem] text-[1rem] font-light leading-[1.8] text-mist">
            {world.body}
          </p>
          <div data-intro className="mt-10 flex items-center gap-6">
            <PillLink href={world.cta.href} label={world.cta.label} />
            <span
              key={active}
              data-place-label
              aria-live="polite"
              className="hidden text-[0.66rem] uppercase tracking-[0.3em] text-lilac lg:block"
            >
              {active >= 0 ? places[active].name : ""}
            </span>
          </div>
        </div>

        <ul className="scrollbar-none flex gap-4 overflow-x-auto pb-2 lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0">
          {places.map((place, i) => (
            <li key={place.id} data-place className="shrink-0">
              <button
                type="button"
                onMouseEnter={preview(i)}
                onFocus={preview(i)}
                onClick={preview(i)}
                aria-pressed={i === active}
                data-cursor="Look"
                className="group flex items-center gap-4 text-left"
              >
                <span
                  className={`relative block h-14 w-20 shrink-0 overflow-hidden border transition-[border-color,box-shadow,transform] duration-500 ${
                    i === active
                      ? "scale-105 border-glow/70 shadow-[0_0_30px_rgb(139_92_246/0.4)]"
                      : "border-line opacity-70 group-hover:opacity-100"
                  }`}
                >
                  <Image
                    src={place.image.src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </span>
                <span
                  className={`text-[0.68rem] uppercase tracking-[0.24em] transition-colors duration-500 ${
                    i === active ? "text-bone" : "text-ash group-hover:text-mist"
                  }`}
                >
                  {place.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
