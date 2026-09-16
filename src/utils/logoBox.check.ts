/**
 * Self-check for every on-screen logo box.
 *
 *   node --experimental-strip-types src/utils/logoBox.check.ts
 *
 * Two bugs this guards, both seen in the app:
 *  - a box with no explicit width/height falls back to the asset's own size,
 *    so the logo renders thousands of pixels wide and swallows the screen;
 *  - a box with the wrong ratio makes `contain` shrink and centre the logo,
 *    leaving dead space that pushes it away from whatever it sits next to.
 */

import assert from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';

const root = new URL('../..', import.meta.url);

// PNG IHDR: width and height are two big-endian uint32 at byte 16.
const png = readFileSync(new URL('public/logo.png', root));
const logoW = png.readUInt32BE(16);
const logoH = png.readUInt32BE(20);
const ratio = logoW / logoH;
assert.ok(logoW > 0 && logoH > 0, 'unreadable logo.png header');

// URLs, not paths — readFileSync takes them as-is and Windows drive letters
// survive, which `url.pathname` mangles into "/C:/...".
const files: URL[] = [];
const walk = (dir: URL) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    if (entry.isDirectory()) walk(new URL(`${entry.name}/`, dir));
    else if (entry.name.endsWith('.tsx')) files.push(new URL(entry.name, dir));
  }
};
walk(new URL('src/', root));

let checked = 0;
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const name = file.pathname.split('/').pop();

  for (const image of src.match(/<Image\b[\s\S]*?\/>/g) || []) {
    if (!image.includes('public/logo.png')) continue;

    const styleName = image.match(/style=\{\[?styles\.(\w+)/)?.[1];
    assert.ok(styleName, `${name}: logo <Image> with no styles.* box`);

    const block = src.match(new RegExp(`\\n  ${styleName}: \\{\\n(?:    .*\\n)*?  \\},`))?.[0];
    assert.ok(block, `${name}: styles.${styleName} is not defined — the logo will render full size`);

    const width = Number(block.match(/width: (\d+(?:\.\d+)?),/)?.[1]);
    const height = Number(block.match(/height: (\d+(?:\.\d+)?),/)?.[1]);
    assert.ok(width > 0, `${name}: styles.${styleName} needs an explicit numeric width`);
    assert.ok(height > 0, `${name}: styles.${styleName} needs an explicit numeric height`);

    const off = Math.abs(width / height - ratio) / ratio;
    assert.ok(
      off < 0.02,
      `${name}: styles.${styleName} is ${width}x${height} (${(width / height).toFixed(2)}:1) ` +
        `but logo.png is ${logoW}x${logoH} (${ratio.toFixed(2)}:1) — use width ${Math.round(height * ratio)}`
    );
    checked++;
  }
}

assert.ok(checked >= 12, `expected the whole app's logos, only found ${checked}`);
console.log(`logoBox.check.ts OK — ${checked} logo boxes at ${ratio.toFixed(3)}:1`);
