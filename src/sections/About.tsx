"use client";

import Image from "next/image";
import { useRef } from "react";

import { about } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { CLIP, fadeUp, revealLines } from "@/lib/animations";
import { queries } from "@/lib/media";
import { useGsap } from "@/hooks/useGsap";
import { Band } from "@/components/Band";
import { PillLink } from "@/components/PillLink";
import { SectionRail } from "@/components/SectionRail";

const beats = about.beats;

const FRAGMENT_POSITIONS = [
  "lg:right-[4vw] lg:top-[12%] lg:w-[19vw]",
  "lg:right-[6vw] lg:bottom-[10%] lg:w-[15vw]",
  "lg:right-[3vw] lg:top-[22%] lg:w-[22vw]",
];

const FRAGMENT_WIPES = [CLIP.fromBottom, CLIP.fromRight, CLIP.fromTop];

export function About() {
  const rootRef = useRef<HTMLElement>(null);

  useGsap(rootRef, (root) => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(
      { desktop: queries.desktop, mobile: queries.mobile, reduce: queries.reduce },
      (context) => {
        const { desktop, reduce } = context.conditions as Record<string, boolean>;
        if (reduce) return;

        const beatEls = q("[data-beat]");
        const fragments = q("[data-fragment]");

        gsap.set(q("[data-about-quote-line], [data-about-fade], [data-rail]"), { autoAlpha: 0 });
        gsap.set(q("[data-about-plate]"), { clipPath: CLIP.fromBottom });

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top 70%", once: true } })
          .fromTo(q("[data-about-plate]"), { clipPath: CLIP.fromBottom }, { clipPath: CLIP.full, duration: 2.2, ease: "drift" }, 0)
          .fromTo(q("[data-about-img]"), { scale: 1.2 }, { scale: 1.08, duration: 2.8, ease: "drift" }, 0)
          .add(fadeUp(q("[data-rail]"), { duration: 0.9, stagger: 0.08 }), 0.15)
          .set(q("[data-about-quote-line]"), { autoAlpha: 1 }, 0.35)
          .add(revealLines(q("[data-about-quote-line]"), { duration: 1.2, stagger: 0.12 }), 0.35)
          .add(fadeUp(q("[data-about-fade]"), { duration: 1, stagger: 0.1 }), 0.9);

        if (!desktop) {
          beatEls.forEach((beat, i) => {
            gsap.fromTo(
              beat.querySelectorAll("[data-beat-item]"),
              { autoAlpha: 0, y: 40 },
              { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, scrollTrigger: { trigger: beat, start: "top 75%", once: true } }
            );
            gsap.fromTo(
              fragments[i],
              { clipPath: FRAGMENT_WIPES[i] },
              { clipPath: CLIP.full, duration: 1.6, ease: "drift", scrollTrigger: { trigger: beat, start: "top 70%", once: true } }
            );
          });
          return;
        }

        beatEls.forEach((beat, i) => {
          gsap.set(beat.querySelectorAll("[data-beat-item]"), { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 70 });
          gsap.set(fragments[i], { clipPath: i === 0 ? CLIP.full : FRAGMENT_WIPES[i] });
        });

        const story = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * (beats.length - 1) * 1.1 + window.innerHeight * 0.6}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const total = beats.length - 1 + 0.6;

        beats.forEach((_, i) => {
          if (i === 0) return;
          const at = i - 1 + 0.55;
          const prev = beatEls[i - 1].querySelectorAll("[data-beat-item]");
          const next = beatEls[i].querySelectorAll("[data-beat-item]");

          story
            .to(prev, { autoAlpha: 0, y: -70, duration: 0.35, stagger: 0.03, ease: "none" }, at)
            .to(fragments[i - 1], { clipPath: FRAGMENT_WIPES[(i + 1) % FRAGMENT_WIPES.length], duration: 0.35, ease: "none" }, at)
            .to(next, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "none" }, at + 0.25)
            .to(fragments[i], { clipPath: CLIP.full, duration: 0.5, ease: "none" }, at + 0.3)
            .fromTo(fragments[i].querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 0.8, ease: "none" }, at + 0.3);
        });

        story
          .fromTo(q("[data-about-drift]"), { scale: 1 }, { scale: 1.16, yPercent: -4, duration: total, ease: "none" }, 0)
          .fromTo(q("[data-story-progress]"), { scaleY: 0 }, { scaleY: 1, duration: total, ease: "none" }, 0)
          .to(q("[data-about-copy]"), { yPercent: -6, duration: total, ease: "none" }, 0);
      }
    );

    return () => mm.revert();
  });

  const { quote, body, cta, background } = about;

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink lg:h-screen"
      aria-labelledby="about-title"
    >
      <div className="absolute inset-0">
        <Band>
          <div data-about-plate className="absolute inset-0">
            <div data-about-drift className="absolute inset-[-6%] origin-[50%_40%]">
              <div data-about-img className="absolute inset-0 origin-center">
                <Image
                  src={background.src}
                  alt={background.alt}
                  fill
                  quality={80}
                  sizes="116vw"
                  className="object-cover object-[50%_45%]"
                />
              </div>
            </div>

            <div aria-hidden className="absolute inset-0 bg-ink/45" />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgb(139_92_246/0.16),transparent_60%)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,rgb(7_6_12/0.4)_18%,transparent_45%,transparent_60%,rgb(7_6_12/0.6)_88%,var(--color-ink)_100%)]"
            />
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-ink via-ink/80 to-transparent"
            />
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow/35 to-transparent" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-glow/25 to-transparent" />
          </div>
        </Band>
      </div>

      <SectionRail id="about" jpClassName="top-24 xl:top-28" />

      <span className="absolute bottom-[12%] left-[5.5vw] top-[22%] hidden w-px bg-line lg:block xl:left-[6.5vw]">
        <span data-story-progress className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-violet to-glow" />
      </span>

      <div className="relative z-10 flex min-h-[100svh] flex-col px-6 pb-24 pt-44 lg:h-screen lg:min-h-0 lg:pb-20 lg:pl-[10vw] lg:pr-[8vw] lg:pt-32 3xl:pl-[12vw]">
        <div data-about-copy className="lg:grid lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-x-8">
          <blockquote className="max-w-[24rem]">
            <p className="font-display text-[clamp(1.25rem,1.6vw,1.8rem)] leading-[1.4] tracking-[0.02em] text-bone">
              {quote.map((line) => (
                <span key={line} data-about-quote-line className="block">
                  {line}
                </span>
              ))}
            </p>
            <span data-about-fade aria-hidden className="mt-7 block h-px w-14 bg-glow/70" />
            <p data-about-fade className="mt-7 max-w-[20rem] text-[0.86rem] font-light leading-[1.75] text-mist">
              {body}
            </p>
          </blockquote>

          <h2 id="about-title" className="sr-only">
            {beats.map((b) => b.word).join(", ")}
          </h2>

          <div className="relative mt-16 flex flex-col gap-24 lg:mt-0 lg:block lg:gap-0">
            {beats.map((beat, i) => (
              <article key={beat.id} data-beat className="relative lg:absolute lg:inset-0">
                <span
                  data-beat-item
                  lang="ja"
                  aria-hidden
                  className="text-vertical text-outline-glow absolute -left-2 top-0 hidden font-jp text-[clamp(3rem,7vw,7rem)] leading-none tracking-[0.2em] lg:right-auto lg:left-[-6vw] lg:block"
                >
                  {beat.jp}
                </span>

                <div className="lg:absolute lg:bottom-[6%] lg:left-0 lg:max-w-[36vw]">
                  <span
                    data-beat-item
                    className="text-outline block font-display text-[clamp(5rem,16vw,12rem)] leading-[0.85] tracking-[-0.02em]"
                  >
                    {beat.number}
                  </span>
                  <h3
                    data-beat-item
                    className="mt-4 font-display text-[clamp(2.2rem,5vw,4.6rem)] uppercase leading-none tracking-[0.06em] text-bone"
                  >
                    {beat.word}
                  </h3>
                  <p data-beat-item className="mt-5 max-w-[24rem] text-[0.95rem] font-light leading-[1.75] text-mist">
                    {beat.line}
                  </p>
                </div>

                <figure
                  data-fragment
                  className={`relative mt-10 aspect-[3/4] w-[60%] max-w-[16rem] overflow-hidden border border-line lg:absolute lg:mt-0 lg:max-w-none ${FRAGMENT_POSITIONS[i]}`}
                >
                  <Image
                    src={beat.image.src}
                    alt={beat.image.alt}
                    fill
                    quality={80}
                    sizes="(min-width: 1024px) 24vw, 60vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  <figcaption className="absolute bottom-3 left-3 text-[0.6rem] uppercase tracking-[0.28em] text-mist">
                    {beat.number} — {beat.word}
                  </figcaption>
                </figure>
              </article>
            ))}
          </div>
        </div>

        <div data-about-fade className="mt-16 lg:mt-0">
          <PillLink href={cta.href} label={cta.label} />
        </div>
      </div>
    </section>
  );
}
