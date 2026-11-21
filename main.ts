// Twin Views hand-in (Node 22, standard library only). The game is this
// directory's game/ folder: plain static files a desktop browser loads
// offline, no build step and no network request. This program copies game/
// and screenshots/ into the output directory and writes dossier.json, the
// summary the judge reads, with the vendored make.fun library.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Play the game locally first with `node serve.ts`.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from: string, to: string): void {
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
copyTree(join(repoRoot, 'game'), join(outDir, 'game'));
copyTree(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));

// The scorer's own caps: only text_max_bytes shapes the bytes; the rest
// refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files in game/ or 48 MiB of game files, or a
// path under game/ over 1000 bytes).
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

// One line on stdout so a build log shows what was handed in; stdout is
// not part of the output, so this cannot change the dossier bytes.
const dossierBytes = readFileSync(join(outDir, 'dossier.json')).length;
const shotCount = readdirSync(join(outDir, 'screenshots')).filter((f) => !f.startsWith('.')).length;
console.log(`Twin Views handed in: game/ + ${shotCount} screenshots, dossier.json ${dossierBytes} bytes.`);
