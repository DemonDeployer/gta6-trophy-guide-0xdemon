// Leonida Legend — GTA VI trophy guide, entrypoint (Node 22, standard library only).
//
// The guide itself is plain static files under app/ (index.html, app.js, style.css
// and data/trophies.json), written to open in a desktop browser and work offline:
// nothing is fetched from the network at runtime. This program hands the guide in
// for grading: it copies app/ and screenshots/ beside this file into the output
// directory and writes dossier.json there, using make.fun's vendored dossier
// library (vendor/makefun-frontend.ts, copied from the kit unchanged — do not edit
// it, or the scorer's byte-for-byte dossier check will fail).
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's sandbox MAKEFUN_OUTPUT_DIR is unset and /output is used.
// Serve the guide while developing with: node serve.ts  (http://localhost:8080)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's gate: at most 4 screenshots of at most 256 KiB each,
// at most 993 files and 48 MiB under app/. Passing them here makes this program fail
// exactly where the scorer would refuse the entry, instead of later.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
