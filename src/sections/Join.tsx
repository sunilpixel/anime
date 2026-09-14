"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent, type MouseEvent } from "react";

import { join, navLinks, siteName } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { CLIP, clipReveal, driftLoop, fadeUp, magnetic, pointerParallax, revealLines } from "@/lib/animations";
import { queries } from "@/lib/media";
import { useGsap } from "@/hooks/useGsap";
import { Band } from "@/components/Band";
import { SectionRail } from "@/components/SectionRail";
import { scrollToTarget, useLenis } from "@/components/SmoothScroll";
import { ArrowRight, Discord, Instagram, Twitter, YouTube } from "@/components/Icons";

const socialIcons = {
  twitter: Twitter,
  instagram: Instagram,
  youtube: YouTube,
  discord: Discord,
};

export function Join() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [subscribed, setSubscribed] = useState(false);

  useGsap(rootRef, (root) => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(
      { desktop: queries.desktop, mobile: queries.mobile, reduce: queries.reduce },
      (context) => {
        const { desktop, reduce } = context.conditions as Record<string, boolean>;
        if (reduce) return;

        const k = desktop ? 1 : 0.45;

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top 70%", once: true } })
          .fromTo(q("[data-join-eye]"), { clipPath: CLIP.fromRight, scale: 1.3 }, { clipPath: CLIP.full, scale: 1.1, duration: 2.4, ease: "drift" }, 0)
          .fromTo(q("[data-join-smoke]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 2.5 }, 0.6)
          .add(revealLines(q("[data-join-title]"), { duration: 1.2, stagger: 0.12 }), 0)
          .add(fadeUp(q("[data-join-copy]")), 0.35)
          .add(fadeUp(q("[data-join-form]")), 0.5)
          .add(fadeUp(q("[data-join-item]"), { stagger: 0.06 }), 0.62)
          .add(clipReveal(q("[data-join-rule]"), CLIP.fromLeft, { duration: 1.1 }), 0.95);

        gsap
          .timeline({
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          })
          .fromTo(q("[data-join-bg]"), { yPercent: -7 * k }, { yPercent: 7 * k, ease: "none" }, 0)
          .fromTo(q("[data-join-smoke]"), { yPercent: 10 * k }, { yPercent: -18 * k, ease: "none" }, 0)
          .fromTo(
            q("[data-join-glow]"),
            { yPercent: -16 * k, autoAlpha: 0.4 },
            { yPercent: 16 * k, autoAlpha: 1, ease: "none" },
            0
          );

        driftLoop(q("[data-join-smoke-drift]"), 24);

        const cleanups = [magnetic(q("[data-magnet]"), 0.3)];
        if (desktop) cleanups.push(pointerParallax(q("[data-parallax]")));
        return () => cleanups.forEach((fn) => fn());
      }
    );

    return () => mm.revert();
  });

  const go = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget(lenis, href);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
  };

  const words = join.title.lead.split(" ");

  return (
    <section
      id="join"
      ref={rootRef}
      aria-labelledby="join-title"
      className="relative isolate min-h-[80svh] overflow-hidden bg-ink"
    >
      <Band>
        <div className="absolute inset-y-0 right-0 w-full lg:w-[66%]">
          <div data-join-bg className="absolute inset-[-10%]">
            <div data-parallax="-18" className="absolute inset-0">
              <div data-join-eye className="absolute inset-0 origin-[60%_50%]">
                <Image
                  src={join.eye.src}
                  alt={join.eye.alt}
                  fill
                  quality={80}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="object-cover object-[58%_45%] opacity-40 brightness-[0.7] contrast-[1.2] saturate-[1.3] lg:opacity-85"
                />
                <span aria-hidden className="absolute inset-0 bg-indigo/40 mix-blend-multiply" />
                <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_58%_45%,rgb(167_139_250/0.35),transparent_28%)] mix-blend-screen" />
              </div>
            </div>
            <div data-join-smoke data-parallax="22" className="absolute inset-0 mix-blend-screen">
              <div data-join-smoke-drift className="absolute inset-[-8%] origin-center">
                <Image
                  src={join.smoke.src}
                  alt=""
                  fill
                  quality={70}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="object-cover object-[55%_50%] opacity-60"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-ink)_0%,var(--color-ink)_30%,rgb(7_6_12/0.7)_52%,rgb(7_6_12/0.2)_74%,transparent_92%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_46%,transparent_16%,rgb(7_6_12/0.5)_64%,var(--color-ink)_100%)]"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/55 lg:hidden" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent"
        />
      </Band>

      <div
        data-join-glow
        aria-hidden
        className="pointer-events-none absolute right-[-20%] top-[10%] size-[75vw] rounded-full bg-violet/20 blur-[150px] lg:right-[4%] lg:top-[6%] lg:size-[34vw]"
      />

      <SectionRail id="join" />

      <div className="relative z-10 flex min-h-[80svh] flex-col justify-start px-6 pb-20 pt-44 lg:justify-center lg:pb-28 lg:pl-[9vw] lg:pr-[20vw] lg:pt-36 xl:pr-[24vw] 3xl:pl-[12vw]">
        <div className="grid gap-y-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start lg:gap-x-[3vw]">
          <div>
            <h2
              id="join-title"
              data-join-title
              className="font-display text-[clamp(2.1rem,11vw,3rem)] uppercase leading-[0.95] tracking-[0.02em] text-bone lg:text-[clamp(2.1rem,2.9vw,3.4rem)]"
            >
              {words.slice(0, -1).join(" ")}
              <br />
              {words[words.length - 1]}
              <span className="glow-text text-lilac">{join.title.accent}</span>
            </h2>

            <p
              data-join-copy
              className="mt-6 max-w-sm text-[0.9rem] font-light leading-[1.7] text-ash lg:mt-7"
            >
              {join.caption}
            </p>
          </div>

          <form
            data-join-form
            onSubmit={onSubmit}
            aria-label={`Subscribe to ${siteName} updates`}
            className="max-w-md lg:mt-3"
          >
            <label htmlFor="join-email" className="sr-only">
              {join.placeholder}
            </label>
            <div className="glass flex items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 transition-[border-color,box-shadow] duration-500 focus-within:border-glow/60 focus-within:shadow-[0_0_36px_rgb(139_92_246/0.25)]">
              <input
                id="join-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={join.placeholder}
                className="min-w-0 flex-1 bg-transparent py-2 text-[0.88rem] text-bone outline-none placeholder:text-ash focus:outline-none focus-visible:outline-none"
              />
              <button
                type="submit"
                data-magnet
                aria-label={join.submitLabel}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-glow text-ink transition-[transform,background-color] duration-500 hover:scale-105 hover:bg-lilac"
              >
                <ArrowRight width={15} height={15} />
              </button>
            </div>
            <p
              aria-live="polite"
              className="mt-3 pl-6 text-[0.68rem] uppercase tracking-[0.2em] text-lilac"
            >
              {subscribed ? "You’re on the list." : ""}
            </p>
          </form>

          <div className="lg:mt-1">
            <ul className="flex items-center gap-4 lg:gap-5">
              {join.socials.map((social) => {
                const Icon = socialIcons[social.id];
                return (
                  <li key={social.id} data-join-item>
                    <a
                      href="#"
                      data-magnet
                      aria-label={social.label}
                      className="grid size-9 place-items-center rounded-full text-mist transition-[color,transform] duration-500 hover:-translate-y-0.5 hover:text-bone"
                    >
                      <Icon width={19} height={19} />
                    </a>
                  </li>
                );
              })}
            </ul>

            <footer className="mt-10 lg:mt-12">
              <nav aria-label="Footer">
                <ul data-join-item className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        onClick={go(link.href)}
                        className="text-[0.78rem] text-mist transition-colors duration-500 hover:text-bone"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <p data-join-item className="mt-5 text-[0.72rem] leading-[1.6] text-ash">
                {join.copyright}
              </p>
            </footer>
          </div>
        </div>

        <div className="mt-14 lg:absolute lg:bottom-14 lg:right-[3vw] lg:mt-0 lg:text-right xl:right-[4vw]">
          <p
            data-join-item
            className="text-[0.7rem] font-medium uppercase leading-[1.8] tracking-[0.26em] text-bone/85"
          >
            {join.tail[0]}
            <br />
            {join.tail[1]}
          </p>
          <span data-join-rule aria-hidden className="mt-3 block h-px w-12 bg-glow/60 lg:ml-auto" />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-ink to-transparent"
      />
    </section>
  );
}
