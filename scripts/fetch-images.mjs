import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const OUT = "public/images";
const ONLY = process.argv[2];
const CONCURRENCY = 3;

const JOBS = [
  ["hero/background.webp", "2WSVjnvIQDs", 2560, 78],
  ["hero/figure.webp", "OCfrPOWr_0w", 2000, 86],

  ["featured/shibuya.webp", "Lf6iovoj-Qg", 1400, 84],
  ["featured/cursed-womb.webp", "1742138104342-eee6ce6ed855", 1400, 84],
  ["featured/sukuna-revival.webp", "1658270600988-7e6a66ed253e", 1400, 84],
  ["featured/hidden-inventory.webp", "1724795020042-1b10166be81c", 1400, 84],
  ["featured/death-painting.webp", "Jknlm0RW1ec", 1400, 84],

  ["characters/gojo.webp", "OCfrPOWr_0w", 1800, 86],
  ["characters/itadori.webp", "1770896689034-770c5d284163", 1800, 86],
  ["characters/fushiguro.webp", "HjUxhaYTCJQ", 1800, 86],
  ["characters/nobara.webp", "Rnt2eZSuPk8", 1800, 86],
  ["characters/sukuna.webp", "1754474541446-965c3e5d8f22", 1800, 86],
  ["characters/geto.webp", "1770718537574-02a19893b2cb", 1800, 86],

  ["episodes/ep-09.webp", "1542051841857-5f90071e7989", 2560, 82],
  ["episodes/ep-10.webp", "1528360983277-13d401cdc186", 2560, 82],
  ["episodes/ep-11.webp", "2gfO718ZtT0", 2560, 82],
  ["episodes/ep-12.webp", "1533050487297-09b450131914", 2560, 82],

  ["world/background.webp", "0vC0N7PImuo", 2560, 82],
  ["world/tokyo.webp", "1503899036084-c55cdd92da26", 2560, 82],
  ["world/kyoto.webp", "YezJ19niGgs", 2560, 82],
  ["world/shibuya.webp", "1554797589-7241bb691973", 2560, 82],
  ["world/jujutsu-high.webp", "L1QC3g8BbsY", 2560, 82],

  ["about/background.webp", "1759586004943-d2ff85a4f76e", 2560, 82],
  ["about/fragment-1.webp", "1769248420960-c8ce3447fb82", 1400, 84],
  ["about/fragment-2.webp", "StjF5mi0owM", 1400, 84],
  ["about/fragment-3.webp", "1444703686981-a3abbc4d4fe3", 1400, 84],

  ["join/eye.webp", "82KqiTVM6Co", 2560, 84],
  ["join/smoke.webp", "VQ41v-gnd1M", 1800, 78],
];

const isRaw = (id) => /^\d{10,13}-[0-9a-f]{12}$/.test(id);
const source = (id) => (isRaw(id) ? `https://unsplash.com/photos/photo-${id}` : `https://unsplash.com/photos/${id}`);
const download = (id, width) =>
  isRaw(id)
    ? `https://images.unsplash.com/photo-${id}?w=${width}&q=90&fm=jpg&fit=max`
    : `https://unsplash.com/photos/${id}/download?w=${width}&force=true`;

async function fetchBuffer(url) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt === 4) throw err;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

const cache = new Map();
const cached = (id, width) => {
  const key = `${id}@${width}`;
  if (!cache.has(key)) cache.set(key, fetchBuffer(download(id, width)));
  return cache.get(key);
};

let cursor = 0;

async function worker() {
  while (cursor < JOBS.length) {
    const [file, id, width, quality] = JOBS[cursor++];
    if (ONLY && !file.includes(ONLY)) continue;
    const target = `${OUT}/${file}`;
    await mkdir(dirname(target), { recursive: true });
    const input = await cached(id, Math.max(width, 1400));
    const info = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(target);
    console.log(`${file.padEnd(32)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} kB`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const credits = [
  "# Artwork",
  "",
  "Photography from [Unsplash](https://unsplash.com), used under the Unsplash License.",
  "Regenerate everything with `node scripts/fetch-images.mjs`; the mapping lives in that script.",
  "",
  "| File | Source |",
  "| --- | --- |",
  ...JOBS.map(([file, id]) => `| \`${file}\` | ${source(id)} |`),
  "",
].join("\n");

await writeFile(`${OUT}/README.md`, credits);
console.log(`credits written to ${OUT}/README.md`);
