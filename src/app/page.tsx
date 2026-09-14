import { Hero } from "@/sections/Hero";
import { Featured } from "@/sections/Featured";
import { Characters } from "@/sections/Characters";
import { Episodes } from "@/sections/Episodes";
import { World } from "@/sections/World";
import { About } from "@/sections/About";
import { Join } from "@/sections/Join";
import { Marquee } from "@/components/Marquee";
import { ticker } from "@/content/site";

export default function Home() {
  return (
    <main>
      <Hero />
      <Featured />
      <Marquee items={ticker.arcs} className="relative z-10 border-y border-line bg-ink py-5 lg:py-7" />
      <Characters />
      <Episodes />
      <World />
      <About />
      <Marquee items={ticker.ending} className="relative z-10 border-y border-line bg-ink py-5 lg:py-7" speed={50} />
      <Join />
    </main>
  );
}
