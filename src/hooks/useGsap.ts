import type { DependencyList, RefObject } from "react";

import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type Setup<T extends HTMLElement> = (root: T, ctx: gsap.Context) => void | (() => void);

export function useGsap<T extends HTMLElement>(
  ref: RefObject<T | null>,
  setup: Setup<T>,
  deps: DependencyList = []
) {
  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    let teardown: void | (() => void);
    const ctx = gsap.context((self) => {
      teardown = setup(root, self);
    }, root);

    return () => {
      teardown?.();
      ctx.revert();
    };
  }, deps);
}
