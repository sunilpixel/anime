"use client";

import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";

import { hero, sections } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { CLIP, driftLoop, fadeUp, pointerParallax, revealChars, revealLines, riseChars } from "@/lib/animations";
import { prefersReducedMotion, queries } from "@/lib/media";
import { onReady } from "@/lib/ready";
import { useGsap } from "@/hooks/useGsap";
import { SectionRail } from "@/components/SectionRail";
import { Particles } from "@/components/Particles";
import { scrollToTarget, useLenis } from "@/components/SmoothScroll";
import { Play } from "@/components/Icons";

const figures = hero.figures;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useGsap(rootRef, (root, ctx) => {
    const q = gsap.utils.selector(root);
    const plates = q("[data-plate]");

    const staged = q("[data-copy], [data-name-block], [data-meta], [data-rail], [data-glow], [data-outline]");

    gsap.set(root, { autoAlpha: 1 });
    gsap.set(plates, { autoAlpha: 0 });
    gsap.set(plates[0], { autoAlpha: 1 });
    if (!prefersReducedMotion()) {
      gsap.set(staged, { autoAlpha: 0 });
      gsap.set(q("[data-figure]"), { clipPath: CLIP.fromBottom });
    }

    const intro = () => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: "drift" } })
        .set(q("[data-copy], [data-name-block]"), { autoAlpha: 1 }, 0)
        .fromTo(q("[data-bg-img]"), { scale: 1.2 }, { scale: 1, duration: 3 }, 0)
        .fromTo(q("[data-figure]"), { clipPath: CLIP.fromBottom, yPercent: 8 }, { clipPath: CLIP.full, yPercent: 0, duration: 2 }, 0.1)
        .fromTo(plates[0], { scale: 1.16 }, { scale: 1, duration: 3 }, 0.1)
        .fromTo(q("[data-glow]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 2.6, stagger: 0.3 }, 0.3)
        .fromTo(q("[data-outline]"), { autoAlpha: 0, xPercent: -6 }, { autoAlpha: 1, xPercent: 0, duration: 2.4 }, 0.5)
        .add(revealChars(q("[data-kanji]")), 0.5)
        .add(fadeUp(q("[data-eyebrow]")), 1.05)
        .add(revealLines(q("[data-quote]")), 1.15)
        .add(fadeUp(q("[data-author]"), { duration: 0.8 }), 1.5)
        .add(riseChars(q("[data-name-line]"), { stagger: 0.045 }), 1)
        .add(fadeUp(q("[data-meta], [data-rail]"), { stagger: 0.05 }), 1.45);
    };

    const offReady = onReady(() => ctx.add(intro));

    const swap = (next: number) => {
      const prev = activeRef.current;
      if (next === prev) return;
      activeRef.current = next;
      setActive(next);

      const instant = prefersReducedMotion();
      gsap.to(plates[prev], { autoAlpha: 0, scale: 1.06, duration: instant ? 0 : 0.9, ease: "power2.inOut" });
      gsap.fromTo(
        plates[next],
        { autoAlpha: 0, scale: 1.14, clipPath: CLIP.fromBottom },
        { autoAlpha: 1, scale: 1, clipPath: CLIP.full, duration: instant ? 0 : 1.3, ease: "power3.inOut" }
      );
    };

    const onSelect = ((e: CustomEvent<number>) => swap(e.detail)) as EventListener;
    root.addEventListener("figureselect", onSelect);

    const mm = gsap.matchMedia();

    mm.add(
      { desktop: queries.desktop, mobile: queries.mobile, reduce: queries.reduce },
      (context) => {
        const { desktop, reduce } = context.conditions as Record<string, boolean>;
        if (reduce) return;

        const k = desktop ? 1 : 0.4;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
              pin: desktop,
              pinSpacing: false,
              anticipatePin: 1,
            },
          })
          .to(q("[data-figure]"), { yPercent: -10 * k, scale: 1 + 0.08 * k, ease: "none" }, 0)
          .to(q("[data-bg]"), { yPercent: 12 * k, ease: "none" }, 0)
          .to(q("[data-outline]"), { xPercent: 18 * k, ease: "none" }, 0)
          .to(q("[data-copy]"), { yPercent: 26 * k, ease: "none" }, 0)
          .to(q("[data-name-block]"), { yPercent: 36 * k, ease: "none" }, 0)
          .to(q("[data-stage]"), { scale: desktop ? 0.9 : 1, ease: "none" }, 0)
          .to(q("[data-veil]"), { autoAlpha: 1, ease: "power1.in" }, 0);

        driftLoop(q("[data-glow]"));

        if (!desktop) return;
        return pointerParallax(q("[data-parallax]"));
      }
    );

    return () => {
      offReady();
      root.removeEventListener("figureselect", onSelect);
      mm.revert();
    };
  });

  const go = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget(lenis, href);
  };

  const choose = (i: number) => () => {
    rootRef.current?.dispatchEvent(new CustomEvent("figureselect", { detail: i }));
  };

  return (
    <section
      id="intro"
      ref={rootRef}
      style={{ visibility: "hidden" }}
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink"
      aria-labelledby="hero-title"
    >
      <div data-stage className="absolute inset-0 origin-[50%_80%]">
        <div data-bg className="absolute -inset-y-[8%] inset-x-0">
          <div data-parallax="14" className="absolute inset-0">
            <div data-bg-img className="absolute inset-0 origin-center">
              <Image
                src={hero.background.src}
                alt=""
                fill
                preload
                quality={80}
                sizes="100vw"
                className="object-cover object-[50%_40%] opacity-50 saturate-[0.85]"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,transparent_10%,rgb(7_6_12/0.75)_65%,var(--color-ink)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/50 to-transparent lg:via-ink/20" />
        </div>

        <div
          data-glow
          aria-hidden
          className="pointer-events-none absolute left-[-10%] top-[10%] size-[55vw] rounded-full bg-indigo/30 blur-[140px] lg:left-[18%] lg:size-[36vw]"
        />
        <div
          data-glow
          aria-hidden
          className="pointer-events-none absolute right-[-5%] top-[-10%] size-[60vw] rounded-full bg-violet/25 blur-[160px] lg:right-[8%] lg:size-[42vw]"
        />

        <div
          data-figure
          className="absolute inset-x-0 top-0 h-[68svh] lg:-top-[4%] lg:left-[34%] lg:right-0 lg:h-[108%]"
        >
          <div data-parallax="-26" className="absolute inset-[-4%]">
            {figures.map((figure, i) => (
              <div
                key={figure.src}
                data-plate
                className="mask-fade-b absolute inset-0 origin-[60%_25%] lg:mask-fade-l"
              >
                <Image
                  src={figure.src}
                  alt={figure.alt}
                  fill
                  preload={i === 0}
                  quality={90}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="tint-violet object-cover"
                  style={{ objectPosition: figure.focus }}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_38%,rgb(7_6_12/0.8)_62%,var(--color-ink)_78%)] lg:hidden"
        />

        <Particles count={45} className="absolute inset-0 z-[2] h-full w-full" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,transparent_22%)] lg:bg-[linear-gradient(100deg,var(--color-ink)_0%,var(--color-ink)_17%,rgb(7_6_12/0.86)_33%,rgb(7_6_12/0.3)_55%,transparent_74%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_bottom,rgb(7_6_12/0.6)_0%,transparent_13%),linear-gradient(to_left,rgb(7_6_12/0.7)_0%,rgb(7_6_12/0.22)_6%,transparent_13%)] lg:block"
        />

        <span
          data-outline
          aria-hidden
          className="text-outline pointer-events-none absolute bottom-[9%] left-[-1%] hidden select-none whitespace-nowrap font-display text-[14vw] uppercase leading-none tracking-[0.02em] opacity-70 lg:block"
        >
          {hero.outline}
        </span>
      </div>

      <div data-veil aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-ink opacity-0" />

      <SectionRail id="intro" jpClassName="top-32" />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-[52svh] lg:justify-center lg:pb-32 lg:pl-[9vw] lg:pr-[30vw] lg:pt-36 3xl:pl-[12vw]">
        <div data-copy className="max-w-xl">
          <div data-parallax="10" className="relative inline-block">
            <h1
              id="hero-title"
              data-kanji
              lang="ja"
              className="glow-text font-brush text-[clamp(6.5rem,26vw,9rem)] leading-[0.9] tracking-[-0.02em] text-bone lg:text-[clamp(9rem,14.5vw,15rem)]"
            >
              {hero.kanji}
            </h1>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-[-15%] bottom-[8%] top-[15%] -z-10 rounded-full bg-violet/30 blur-[70px]"
            />
          </div>

          <p data-eyebrow className="eyebrow mt-4 text-mist lg:mt-6">
            {hero.eyebrow}
          </p>

          <blockquote className="mt-6 lg:mt-8">
            <p
              data-quote
              className="max-w-[22rem] text-[1.05rem] font-light leading-[1.55] text-bone/90 lg:max-w-[26rem] lg:text-[1.2rem]"
            >
              &ldquo;{hero.quote}&rdquo;
            </p>
            <footer data-author className="mt-4 flex items-center gap-3 text-[0.72rem] tracking-[0.2em] text-ash">
              <span className="h-px w-6 bg-ash/60" />
              {hero.author}
            </footer>
          </blockquote>

          <div className="mt-10 flex flex-wrap items-center gap-8 lg:mt-12">
            <a
              href={hero.cta.href}
              onClick={go(hero.cta.href)}
              data-meta
              data-cursor="Play"
              className="glass group inline-flex items-center gap-4 rounded-full py-2 pl-2 pr-6 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-bone transition-[border-color,box-shadow] duration-500 hover:border-glow/60 hover:shadow-[0_0_40px_rgb(139_92_246/0.3)]"
            >
              <span className="grid size-10 place-items-center rounded-full bg-bone text-ink transition-transform duration-500 group-hover:scale-105">
                <Play width={14} height={14} className="ml-0.5" />
              </span>
              {hero.cta.label}
            </a>

            <a
              href="#featured"
              onClick={go("#featured")}
              data-meta
              className="hidden items-center gap-4 text-[0.7rem] uppercase tracking-[0.26em] text-ash transition-colors duration-500 hover:text-bone lg:inline-flex"
            >
              <span className="scroll-line" />
              Scroll
            </a>
          </div>
        </div>

        <div
          data-name-block
          className="mt-14 lg:absolute lg:right-[9vw] lg:top-[32%] lg:mt-0 lg:text-right xl:right-[11vw] 3xl:right-[14vw]"
        >
          <h2 className="font-display text-[2.6rem] leading-[0.92] tracking-[0.08em] text-bone lg:text-[clamp(3rem,4.8vw,5rem)]">
            {hero.name.map((line) => (
              <span key={line} data-name-line className="block">
                {line}
              </span>
            ))}
          </h2>
          <div data-meta className="mt-4 flex items-center gap-4 lg:justify-end">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.5em] text-lilac">
              {hero.title}
            </span>
            <span className="h-px w-8 bg-glow/50" />
            <span lang="ja" className="font-jp text-[0.8rem] tracking-[0.3em] text-ash">
              {hero.nameJp}
            </span>
          </div>
        </div>
      </div>

      <ul
        data-meta
        role="tablist"
        aria-label="Hero artwork variations"
        className="absolute right-8 top-[46%] z-20 hidden flex-col gap-3 xl:right-12 xl:flex"
      >
        {figures.map((figure, i) => (
          <li key={figure.src}>
            <button
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={choose(i)}
              data-cursor="View"
              className={`relative block h-[4.6rem] w-14 overflow-hidden border transition-[border-color,box-shadow,transform] duration-500 ${
                i === active
                  ? "scale-105 border-glow/70 shadow-[0_0_24px_rgb(139_92_246/0.3)]"
                  : "border-line opacity-60 hover:border-mist/50 hover:opacity-100"
              }`}
            >
              <Image
                src={figure.src}
                alt={figure.alt}
                fill
                sizes="56px"
                className={`object-cover transition-[filter] duration-500 ${i === active ? "tint-violet" : "grayscale"}`}
                style={{ objectPosition: figure.focus }}
              />
            </button>
          </li>
        ))}
      </ul>

      <div
        data-meta
        className="absolute bottom-14 right-8 z-20 hidden items-center gap-5 lg:flex xl:right-12"
      >
        <span className="font-display text-[0.8rem] tracking-[0.3em] text-bone">
          {sections[0].index}
          <span className="mx-2 text-ash">/</span>
          <span className="text-ash">{sections.at(-1)!.index}</span>
        </span>
        <span className="flex items-center gap-1.5">
          {sections.map((s, i) => (
            <span
              key={s.id}
              className={`block h-1 rounded-full transition-all duration-500 ${i === 0 ? "w-5 bg-glow" : "w-1 bg-ash/40"}`}
            />
          ))}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[28vh] bg-gradient-to-b from-transparent to-ink" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[5%] bottom-[7%] z-10 hidden h-px w-[110%] origin-left -rotate-[2.4deg] bg-gradient-to-r from-transparent via-glow/40 to-transparent lg:block"
      />
    </section>
  );
}
