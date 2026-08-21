// Gate runner. Discovers every `NN-check-*.mjs` gate in this folder, runs them in
// numeric order, and exits 1 if any gate fails. This is the factory loop's single
// entry point: `pnpm verify:gates`.
//
// Add a gate by dropping a new `NN-check-<thing>.mjs` here — no wiring needed.
// Each gate MUST exit 0 when clean and non-zero on violations.
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const DIR = dirname(fileURLToPath(import.meta.url));

const gates = readdirSync(DIR)
  .filter((f) => /^\d+-check-.*\.mjs$/.test(f))
  .sort();

if (gates.length === 0) {
  console.log('No gates found in governance/gates/.');
  process.exit(0);
}

let failed = 0;
for (const gate of gates) {
  console.log(`\n── ${gate} ──`);
  const result = spawnSync('node', [join(DIR, gate)], { stdio: 'inherit' });
  if (result.status !== 0) failed++;
}

console.log(
  `\n${failed === 0 ? '✅' : '❌'} ${gates.length - failed}/${gates.length} gates passed.`,
);
process.exit(failed === 0 ? 0 : 1);
