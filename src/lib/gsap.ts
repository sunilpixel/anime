import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomWiggle } from "gsap/CustomWiggle";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    CustomEase,
    CustomWiggle,
    Flip,
    Observer,
    ScrambleTextPlugin
  );

  CustomEase.create("cinematic", "0.16, 1, 0.3, 1");
  CustomEase.create("drift", "0.38, 0.01, 0.1, 1");
  CustomEase.create("swift", "0.7, 0, 0.2, 1");
  CustomWiggle.create("shudder", { wiggles: 6, type: "easeOut" });

  gsap.defaults({ ease: "cinematic", duration: 1.2 });
  gsap.config({ nullTargetWarn: false, force3D: true });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, Flip, Observer };
