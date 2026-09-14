export const siteName = "Jujutsu Kaisen";
export const siteNameJp = "呪術廻戦";

export const sections = [
  { id: "intro", index: "01", label: "Intro", jp: "最強の呪術師" },
  { id: "featured", index: "02", label: "Featured", jp: "物語はまだ終わってない" },
  { id: "characters", index: "03", label: "Characters", jp: "五条悟" },
  { id: "episodes", index: "04", label: "Episodes", jp: "渋谷事変" },
  { id: "world", index: "05", label: "World", jp: "呪いの世界" },
  { id: "about", index: "06", label: "About", jp: "ただのアニメじゃない" },
  { id: "join", index: "07", label: "Join", jp: "最後まで" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const navLinks: { label: string; href: `#${SectionId}`; id: SectionId }[] = [
  { label: "Home", href: "#intro", id: "intro" },
  { label: "Characters", href: "#characters", id: "characters" },
  { label: "Episodes", href: "#episodes", id: "episodes" },
  { label: "World", href: "#world", id: "world" },
  { label: "About", href: "#about", id: "about" },
];

export const hero = {
  kanji: "呪術",
  eyebrow: "The Strongest",
  quote: "Throughout heaven and earth, I alone am the honored one.",
  author: "Gojo Satoru",
  name: ["Gojo", "Satoru"],
  title: "Limitless",
  nameJp: "五条 悟",
  cta: { label: "Watch the trailer", href: "#episodes" },
  outline: "Limitless",
  background: { src: "/images/hero/background.webp", alt: "" },
  figures: [
    {
      src: "/images/hero/figure.webp",
      alt: "A sorcerer standing in darkness, a band of light burning across his eyes",
      focus: "50% 18%",
    },
    { src: "/images/characters/fushiguro.webp", alt: "A silhouette turned away, lit in blue", focus: "50% 30%" },
    { src: "/images/featured/cursed-womb.webp", alt: "A hooded figure standing in the dark", focus: "50% 30%" },
  ],
} as const;

export const ticker = {
  arcs: ["Shibuya Incident", "渋谷事変", "Cursed Womb", "呪胎戴天", "Hidden Inventory", "懐玉", "Death Painting", "起首雷同"],
  ending: ["Until the End", "最後まで", "Jujutsu Kaisen", "呪術廻戦", "The Strongest", "最強"],
} as const;

export const featured = {
  title: ["Step Into", "Another", "Reality"],
  ghost: "Arcs",
  caption: "Explore the most iconic arcs, characters and moments",
  cta: { label: "Browse the archive", href: "#episodes" },
  cards: [
    {
      id: "shibuya",
      blurb:
        "The night Tokyo broke. A sealed Gojo, a city of curtains, and the war that changed every rule.",
      title: ["Shibuya", "Arc"],
      index: "01",
      image: {
        src: "/images/featured/shibuya.webp",
        alt: "A Tokyo street burning with neon on the night of the incident",
      },
    },
    {
      id: "cursed-womb",
      blurb:
        "A special-grade born in a derelict building, and the first time Itadori understood what he had swallowed.",
      title: ["Cursed", "Womb"],
      index: "02",
      image: {
        src: "/images/featured/cursed-womb.webp",
        alt: "A hooded figure with clawed hands in the dark",
      },
    },
    {
      id: "sukuna-revival",
      blurb:
        "Twenty fingers, one vessel. The King of Curses stretches inside a body that will not surrender.",
      title: ["Sukuna", "Revival"],
      index: "03",
      image: {
        src: "/images/featured/sukuna-revival.webp",
        alt: "Golden armour catching the only light in the room",
      },
    },
    {
      id: "hidden-inventory",
      blurb:
        "Before the strongest stood alone, there were two. The mission that ended a friendship and began an era.",
      title: ["Hidden", "Inventory"],
      index: "04",
      image: {
        src: "/images/featured/hidden-inventory.webp",
        alt: "A long-haired figure rimmed with light against the dark",
      },
    },
    {
      id: "death-painting",
      blurb:
        "Cursed wombs given human shape, and a fight that asked what it costs to stay yourself.",
      title: ["Death", "Painting"],
      index: "05",
      image: {
        src: "/images/featured/death-painting.webp",
        alt: "A woman lit red in a dark hallway",
      },
    },
    {
      id: "shibuya",
      blurb:
        "The night Tokyo broke. A sealed Gojo, a city of curtains, and the war that changed every rule.",
      title: ["Shibuya", "Arc"],
      index: "01",
      image: {
        src: "/images/featured/shibuya.webp",
        alt: "A Tokyo street burning with neon on the night of the incident",
      },
    },
    {
      id: "cursed-womb",
      blurb:
        "A special-grade born in a derelict building, and the first time Itadori understood what he had swallowed.",
      title: ["Cursed", "Womb"],
      index: "02",
      image: {
        src: "/images/featured/cursed-womb.webp",
        alt: "A hooded figure with clawed hands in the dark",
      },
    },
    {
      id: "sukuna-revival",
      blurb:
        "Twenty fingers, one vessel. The King of Curses stretches inside a body that will not surrender.",
      title: ["Sukuna", "Revival"],
      index: "03",
      image: {
        src: "/images/featured/sukuna-revival.webp",
        alt: "Golden armour catching the only light in the room",
      },
    },
    {
      id: "hidden-inventory",
      blurb:
        "Before the strongest stood alone, there were two. The mission that ended a friendship and began an era.",
      title: ["Hidden", "Inventory"],
      index: "04",
      image: {
        src: "/images/featured/hidden-inventory.webp",
        alt: "A long-haired figure rimmed with light against the dark",
      },
    },
    {
      id: "death-painting",
      blurb:
        "Cursed wombs given human shape, and a fight that asked what it costs to stay yourself.",
      title: ["Death", "Painting"],
      index: "05",
      image: {
        src: "/images/featured/death-painting.webp",
        alt: "A woman lit red in a dark hallway",
      },
    },
  ],
} as const;

export const characters = {
  title: { lead: "Charac", accent: "ters" },
  eyebrow: "More than just sorcerers",
  body: "Each character carries a story, a belief, and a battle within.",
  cta: { label: "View All", href: "#episodes" },
  roster: [
    {
      id: "gojo",
      name: ["Gojo", "Satoru"],
      nameJp: "五条 悟",
      role: "Special Grade — Limitless",
      description:
        "The strongest sorcerer alive, and the loneliest. He teaches because he knows what happens to those who stand at the top by themselves.",
      tint: "167 139 250",
      focus: "50% 30%",
      portrait: { src: "/images/characters/gojo.webp", alt: "A band of light across the eyes of the strongest sorcerer" },
    },
    {
      id: "itadori",
      name: ["Yuji", "Itadori"],
      nameJp: "虎杖 悠仁",
      role: "Grade 1 — Sukuna's Vessel",
      description:
        "He swallowed a cursed finger to save a friend and inherited a death sentence. He keeps choosing other people anyway.",
      tint: "244 114 182",
      focus: "50% 28%",
      portrait: { src: "/images/characters/itadori.webp", alt: "A young man lit in pink and blue neon" },
    },
    {
      id: "fushiguro",
      name: ["Megumi", "Fushiguro"],
      nameJp: "伏黒 恵",
      role: "Grade 2 — Ten Shadows",
      description:
        "He decides who deserves saving and carries the arithmetic quietly. His shadows hold more than he admits to anyone.",
      tint: "96 165 250",
      focus: "50% 34%",
      portrait: { src: "/images/characters/fushiguro.webp", alt: "A silhouette turned away, swallowed by blue shadow" },
    },
    {
      id: "nobara",
      name: ["Nobara", "Kugisaki"],
      nameJp: "釘崎 野薔薇",
      role: "Grade 3 — Straw Doll",
      description:
        "She came to Tokyo to be exactly who she wanted, and never once apologised for it. Nails, hammer, absolute certainty.",
      tint: "251 146 60",
      focus: "50% 26%",
      portrait: { src: "/images/characters/nobara.webp", alt: "A woman smiling under hard red light" },
    },
    {
      id: "sukuna",
      name: ["Ryomen", "Sukuna"],
      nameJp: "両面 宿儺",
      role: "Special Grade — King of Curses",
      description:
        "A thousand years sealed in twenty fingers, and still the measure every sorcerer is held against. He is entertained, never invested.",
      tint: "248 113 113",
      focus: "50% 30%",
      portrait: { src: "/images/characters/sukuna.webp", alt: "A swordsman staring straight into the lens" },
    },
    {
      id: "geto",
      name: ["Suguru", "Geto"],
      nameJp: "夏油 傑",
      role: "Special Grade — Curse Manipulation",
      description:
        "He asked what sorcerers owe the people who cannot see curses, and could not live with the answer he arrived at.",
      tint: "129 140 248",
      focus: "50% 24%",
      portrait: { src: "/images/characters/geto.webp", alt: "A hooded figure in a dark cloak reaching out" },
    },
  ],
} as const;

export const episodes = {
  title: ["Relive", "the Moments"],
  caption: ["From cursed beginnings to", "historic battles"],
  cta: { label: "View All", href: "#world" },
  timeline: [
    {
      id: "ep-09",
      label: "S2 EP 9",
      number: "09",
      title: "The Shibuya Incident",
      duration: "24:10",
      synopsis: "The curtain falls over Shibuya and the strongest sorcerer walks in alone.",
      image: { src: "/images/episodes/ep-09.webp", alt: "Shibuya crossing at night, packed with people and light" },
    },
    {
      id: "ep-10",
      label: "S2 EP 10",
      number: "10",
      title: "Thunderclap",
      duration: "23:40",
      synopsis: "Itadori reaches the station and finds the crowd is the trap.",
      image: { src: "/images/episodes/ep-10.webp", alt: "A red lantern in a blue Tokyo alley" },
    },
    {
      id: "ep-11",
      label: "S2 EP 11",
      number: "11",
      title: "Red Scale",
      duration: "24:00",
      synopsis: "A sealed box, a silent platform, and the moment everything stops being survivable.",
      image: { src: "/images/episodes/ep-11.webp", alt: "Red light breaking through steel bars" },
    },
    {
      id: "ep-12",
      label: "S2 EP 12",
      number: "12",
      title: "Fluctuations",
      duration: "23:50",
      synopsis: "Back to back against something neither of them can beat apart.",
      image: { src: "/images/episodes/ep-12.webp", alt: "A narrow Tokyo alley glowing teal and red" },
    },
  ],
} as const;

export const world = {
  title: { lead: "The World of ", accent: "Curses" },
  body: "A deep, dark world where human emotions give birth to curses, and balance is maintained by those who fight in the shadows.",
  cta: { label: "Explore World", href: "#about" },
  background: { src: "/images/world/background.webp", alt: "" },
  places: [
    { id: "tokyo", name: "Tokyo", image: { src: "/images/world/tokyo.webp", alt: "Shinjuku neon signs stacked into the night" } },
    { id: "kyoto", name: "Kyoto", image: { src: "/images/world/kyoto.webp", alt: "Stone steps climbing to red torii gates at night" } },
    { id: "shibuya", name: "Shibuya", image: { src: "/images/world/shibuya.webp", alt: "The city seen from above, lit like a circuit board" } },
    { id: "jujutsu-high", name: "Jujutsu High", image: { src: "/images/world/jujutsu-high.webp", alt: "A shrine entrance glowing with paper lanterns" } },
  ],
} as const;

export const about = {
  quote: ["“It's not just", "a story…", "It's a reflection", "of reality.”"],
  body: "Jujutsu Kaisen explores the thin line between right and wrong, the weight of choices, and what it truly means to be human.",
  cta: { label: "Know More", href: "#join" },
  background: {
    src: "/images/about/background.webp",
    alt: "A lone figure standing in a fog-covered field",
  },
  beats: [
    {
      id: "pain",
      number: "01",
      word: "Pain",
      jp: "痛み",
      line: "Every curse is born from something a person could not carry alone.",
      image: { src: "/images/about/fragment-1.webp", alt: "A lone figure walking down an empty road at dusk" },
    },
    {
      id: "people",
      number: "02",
      word: "People",
      jp: "人",
      line: "Sorcerers do not fight for the world. They fight for the handful of names they refuse to lose.",
      image: { src: "/images/about/fragment-2.webp", alt: "A wooden torii gate deep in a dark forest" },
    },
    {
      id: "purpose",
      number: "03",
      word: "Purpose",
      jp: "目的",
      line: "To die surrounded by people is not the goal. To have been worth surrounding is.",
      image: { src: "/images/about/fragment-3.webp", alt: "A silhouette standing beneath the Milky Way" },
    },
  ],
} as const;

export const join = {
  title: { lead: "Stay Conne", accent: "cted" },
  caption: "Get the latest updates, episodes and more.",
  placeholder: "Enter your email",
  submitLabel: "Subscribe",
  eye: { src: "/images/join/eye.webp", alt: "A single blue eye, wide open in the dark" },
  smoke: { src: "/images/join/smoke.webp", alt: "" },
  socials: [
    { id: "twitter", label: "Twitter" },
    { id: "instagram", label: "Instagram" },
    { id: "youtube", label: "YouTube" },
    { id: "discord", label: "Discord" },
  ],
  copyright: "© 2024 Jujutsu Kaisen. All rights reserved.",
  tail: ["Until", "the End"],
} as const;
