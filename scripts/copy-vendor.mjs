import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vendorDir = join(root, 'scripts', 'vendor');

mkdirSync(vendorDir, { recursive: true });

for (const file of ['gsap.min.js', 'ScrollTrigger.min.js']) {
  copyFileSync(join(root, 'node_modules', 'gsap', 'dist', file), join(vendorDir, file));
}

console.log('Copied GSAP vendor files to scripts/vendor/');
