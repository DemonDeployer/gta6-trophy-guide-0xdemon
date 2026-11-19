// Leonida Legend — GTA VI Trophy Guide & Tracker (gta6-trophy-guide-01).
//
// Entrypoint. The guide itself is plain static files in app/ (an HTML page,
// a script, a stylesheet and the trophy data) plus screenshots/ of it
// running. This file hands both folders to the output directory and writes
// output dossier.json with the vendored make.fun frontend library, which is
// the summary the judge reads. vendor/makefun-frontend.ts is left exactly
// as the kit shipped it.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for the output
// directory:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Determinism: run it twice into two different output directories and
// diff them — the two trees must be byte-identical before the entry is
// handed over. (Verified in-session: two runs, diff -r clean.)
//
// Run from this file's own directory. Node standard library only, apart
// from the vendored buildDossier import below.

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

// Caps the scorer enforces: at most 4 screenshots of at most 256 KiB each,
// at most 993 files and 48 MiB inside app/, and the dossier text budget.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
