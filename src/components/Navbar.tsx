"use client";

import { useRef, useState, type MouseEvent } from "react";

import { navLinks, siteName, siteNameJp } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CLIP } from "@/lib/animations";
import { prefersReducedMotion } from "@/lib/media";
import { onReady } from "@/lib/ready";
import { useGsap } from "@/hooks/useGsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { scrollToTarget, useLenis } from "./SmoothScroll";
import { ArrowRight, Search } from "./Icons";

export function Navbar() {
  const rootRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState("intro");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useGsap(rootRef, (root) => {
    ScrollTrigger.create({
      start: 60,
      end: "max",
      onToggle: (self) => setScrolled(self.isActive),
    });

    const spy = () => {
      const line = window.innerHeight * 0.45;
      let closest = navLinks[0].id;
      let distance = Infinity;

      navLinks.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const { top, bottom } = el.getBoundingClientRect();
        const gap = top <= line && bottom >= line ? 0 : Math.min(Math.abs(top - line), Math.abs(bottom - line));
        if (gap < distance) {
          distance = gap;
          closest = id;
        }
      });

      setActive(closest);
    };

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(spy);
    };

    ScrollTrigger.create({ start: 0, end: "max", onUpdate: schedule, onRefresh: schedule });
    ScrollTrigger.addEventListener("scrollEnd", schedule);
    schedule();

    const items = root.querySelectorAll("[data-nav-item]");
    const offReady = prefersReducedMotion()
      ? () => {}
      : onReady(() => {
          gsap.fromTo(items, { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.07, delay: 0.5 });
        });
    if (!prefersReducedMotion()) gsap.set(items, { autoAlpha: 0 });

    return () => {
      offReady();
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener("scrollEnd", schedule);
    };
  });

  useGsap(menuRef, (menu) => {
    menuTl.current = gsap
      .timeline({ paused: true, defaults: { ease: "swift" } })
      .fromTo(menu, { clipPath: CLIP.fromTop }, { clipPath: CLIP.full, duration: 0.9 })
      .fromTo(
        menu.querySelectorAll("[data-menu-item]"),
        { autoAlpha: 0, y: 44 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "cinematic" },
        0.3
      )
      .fromTo(
        menu.querySelectorAll("[data-menu-meta]"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8 },
        0.7
      );
  });

  useIsomorphicLayoutEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;

    if (prefersReducedMotion()) {
      tl.progress(open ? 1 : 0);
    } else if (open) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.5).reverse();
    }

    if (open) lenis?.stop();
    else lenis?.start();

    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const go = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    lenis?.start();
    scrollToTarget(lenis, href);
  };

  return (
    <header
      ref={rootRef}
      data-scrolled={scrolled}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-700 data-[scrolled=true]:border-line data-[scrolled=true]:bg-ink/55 data-[scrolled=true]:backdrop-blur-xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/70 to-transparent lg:from-ink/40"
      />
      <nav className="mx-auto flex h-20 max-w-[1720px] items-center justify-between px-5 lg:h-24 lg:px-10 xl:px-12">
        <a
          href="#intro"
          onClick={go("#intro")}
          data-nav-item
          className="relative z-10 flex flex-col leading-none"
          aria-label={`${siteName} — back to top`}
        >
          <span className="font-display text-[1.05rem] font-bold tracking-[0.06em] text-bone">
            {siteName}
          </span>
          <span className="mt-1.5 font-jp text-[0.66rem] tracking-[0.55em] text-ash">
            {siteNameJp}
          </span>
        </a>

        <ul className="hidden items-center gap-9 lg:flex xl:gap-11">
          {navLinks.map(({ label, href, id }) => (
            <li key={id} data-nav-item>
              <a
                href={href}
                onClick={go(href)}
                data-active={active === id}
                className="relative block text-[0.78rem] font-medium tracking-[0.14em] text-mist transition-colors duration-500 hover:text-bone data-[active=true]:text-bone"
              >
                <span className="nav-link-text">
                  <span>{label}</span>
                  <span aria-hidden>{label}</span>
                </span>
                <span className="nav-indicator" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            data-nav-item
            aria-label="Search"
            className="glass grid size-10 place-items-center rounded-full text-mist transition-colors duration-500 hover:border-glow/50 hover:text-bone"
          >
            <Search />
          </button>
          <a
            href="#episodes"
            onClick={go("#episodes")}
            data-nav-item
            className="glass group flex items-center gap-3 rounded-full py-2.5 pl-5 pr-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-bone transition-[border-color,box-shadow] duration-500 hover:border-glow/60 hover:shadow-[0_0_36px_rgb(139_92_246/0.28)]"
          >
            Watch now
            <span className="grid size-6 place-items-center rounded-full bg-bone/10 transition-[transform,background-color] duration-500 group-hover:translate-x-0.5 group-hover:bg-glow/30">
              <ArrowRight width={12} height={12} />
            </span>
          </a>
        </div>

        <button
          type="button"
          data-nav-item
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-10 flex size-11 flex-col items-center justify-center gap-[6px] lg:hidden"
        >
          <span
            className={`h-[1.5px] w-6 bg-bone transition-transform duration-500 ease-cinematic ${open ? "translate-y-[3.75px] rotate-45" : ""}`}
          />
          <span
            className={`h-[1.5px] w-6 bg-bone transition-transform duration-500 ease-cinematic ${open ? "-translate-y-[3.75px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <div
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!open}
        style={{ clipPath: CLIP.fromTop }}
        className={`fixed inset-0 -z-10 flex flex-col justify-between bg-ink px-6 pb-10 pt-32 lg:hidden ${open ? "" : "pointer-events-none"}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-1/4 top-1/3 size-[70vw] rounded-full bg-violet/25 blur-[120px]"
        />
        <ul className="relative flex flex-col gap-2">
          {navLinks.map(({ label, href, id }, i) => (
            <li key={id} data-menu-item>
              <a href={href} onClick={go(href)} className="flex items-baseline gap-5 py-2">
                <span className="font-display text-[0.7rem] tracking-[0.2em] text-ash">
                  0{i + 1}
                </span>
                <span
                  className={`font-display text-[clamp(2rem,10vw,2.6rem)] leading-none tracking-[0.02em] transition-colors duration-500 ${active === id ? "text-lilac" : "text-bone"}`}
                >
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div data-menu-meta className="relative flex items-end justify-between">
          <div>
            <span className="eyebrow block">Watch now</span>
            <a
              href="#episodes"
              onClick={go("#episodes")}
              className="mt-3 inline-flex items-center gap-3 border-b border-glow/60 pb-1 text-sm tracking-[0.1em] text-bone"
            >
              Season 2 — The Shibuya Incident <ArrowRight />
            </a>
          </div>
          <span className="text-vertical font-jp text-[0.9rem] tracking-[0.4em] text-ash">
            {siteNameJp}
          </span>
        </div>
      </div>
    </header>
  );
}
