import { sections, type SectionId } from "@/content/site";

type Props = {
  id: SectionId;
  jpClassName?: string;
};

export function SectionRail({ id, jpClassName = "top-32" }: Props) {
  const section = sections.find((s) => s.id === id)!;

  return (
    <>
      <div
        data-rail
        className="pointer-events-none absolute left-5 top-24 z-20 lg:left-10 lg:top-32 xl:left-12"
      >
        <span className="block font-display text-[1.6rem] leading-none tracking-[0.04em] text-bone lg:text-[1.9rem]">
          {section.index}
        </span>
        <span className="eyebrow mt-2 block">{section.label}</span>
      </div>
      <div
        data-rail
        className={`pointer-events-none absolute right-8 z-20 hidden lg:block xl:right-12 ${jpClassName}`}
      >
        <span className="text-vertical font-jp text-[1.2rem] leading-none tracking-[0.42em] text-mist/85">
          {section.jp}
        </span>
      </div>
    </>
  );
}
