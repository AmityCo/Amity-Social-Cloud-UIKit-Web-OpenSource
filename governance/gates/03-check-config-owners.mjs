// Config-owner gate. Fails (exit 1) on any page this build renders or declares
// that no module owns and that is not listed below as deliberately ownerless.
//
// `isExcluded` collects owners from all three segments of a `page/component/
// element` id and withholds if any one of them names a switched-off module. A
// page is the only segment with nothing above it, so a page with no owner is a
// page nothing can ever withhold — and from the outside that is
// indistinguishable from a gate that works. Every other segment has a fallback:
// an ownerless element under an owned page still goes when the page goes.
//
// That makes pages the one case worth failing a build over, and it is a set
// comparison rather than a regex, so it can be a hard gate rather than a
// baselined report like `governance/module-gate/check-flag-consumed.mjs`.
//
// What this does NOT catch: a page that has an owner and never consumes the
// flag. `useAmityPage` returns `isExcluded` and a page is free to drop it on
// the floor — the gate then says withhold while the surface stays, which
// `moduleGraph.ts`'s header calls the dangerous kind. Those pages pass here.
//
// The second way a surface becomes ungatable — a path where not one of the
// three segments names a module — is printed but not failed. Most of those are
// chrome (`back_button`, `title`, `user_avatar`) that no module should own; the
// ones that matter are the real surfaces, and telling them apart needs a
// person.
//
// Run: node governance/gates/03-check-config-owners.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, '..', '..');
const GRAPH = join(ROOT, 'src/v4/core/providers/CustomizationProvider/moduleGraph.ts');
const CONFIG = join(ROOT, 'src/v4/core/providers/CustomizationProvider/utils.ts');

// Pages with no owner, on purpose. Each needs a reason, because the whole point
// of the gate is that an ownerless page is otherwise invisible. Adding a page
// here should be a decision someone can defend later, not a way to get green.
const OWNERLESS_ON_PURPOSE = {
  social_home_page:
    'the social shell that the feed, story tab and search all render inside — ' +
    'gating it would take those three down together, so each is gated at its own component',
  user_profile_page: 'Identity & Session — base layer, always included',
  edit_user_profile_page: 'Identity & Session — base layer, always included',
  notification_tray_page:
    'fed by seven modules at once, so any single owner empties the whole tray when that ' +
    'module goes. Gated per item on tap instead: NotificationItem asks about both the ' +
    'destination page and the subject, and toasts rather than navigating',
};

const table = (src, name) => {
  const start = src.indexOf(`export const ${name}`);
  const body = src.slice(start, src.indexOf('\n};', start));
  const out = {};
  for (const line of body.split('\n')) {
    const m = line.match(/^\s+'?([A-Za-z0-9_.]+)'?:\s*'([a-zA-Z]+)',/);
    if (m) out[m[1]] = m[2];
  }
  return out;
};

const graph = readFileSync(GRAPH, 'utf8');
const pageOwner = table(graph, 'AMITY_PAGE_MODULE');
const componentOwner = table(graph, 'AMITY_COMPONENT_MODULE');
const elementOwner = table(graph, 'AMITY_ELEMENT_MODULE');

// Every `page/component/element` key the default config declares. This is the
// config surface a customer can address, so an id here is one the gate is
// expected to have an answer for.
// `[a-z0-9_*]` in all three segments, not just the last two. Requiring a real
// name in the page segment skipped every key that opens with `*/` — 50 of
// them, a wildcard page with a named component or element under it — so the
// ids inside them were never checked at all.
const keys = [
  ...readFileSync(CONFIG, 'utf8').matchAll(/'([a-z0-9_*]+\/[a-z0-9_*]+\/[a-z0-9_*]+)'\s*:/g),
].map((m) => m[1]);

const pages = new Set();
for (const key of keys) {
  const [page] = key.split('/');
  if (page && page !== '*') pages.add(page);
}

// And the pages the code renders, which is not the same list. Three pageIds
// reach `useAmityPage` without ever appearing in `defaultConfig` —
// `community_story_permission_page`, `event_attendees_page` and `live_chat` —
// so reading the config alone would let one of them lose its owner unseen.
// A page is what it is because something renders it, not because someone
// wrote a config key for it.
const SRC = join(ROOT, 'src/v4');
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!/__tests__|node_modules/.test(name)) walk(p);
    } else if (/\.tsx?$/.test(name) && !/\.test\.|\.stories\./.test(p)) {
      const source = readFileSync(p, 'utf8');
      for (const m of source.matchAll(/pageId\s*[=:]\s*'([a-z0-9_]+)'/g)) pages.add(m[1]);
    }
  }
};
walk(SRC);

const unowned = [...pages].filter((p) => !pageOwner[p]).sort();
const unexplained = unowned.filter((p) => !OWNERLESS_ON_PURPOSE[p]);
const stale = Object.keys(OWNERLESS_ON_PURPOSE)
  .filter((p) => pageOwner[p] || !pages.has(p))
  .sort();

// The other load-bearing case, reported only: a path where not one of the three
// segments names a module. Nothing withholds it, in any configuration.
//
// All three segments, not just the page — `social_home_page/post_composer/
// image_button` sits on an ownerless page and is withheld all the same, because
// `post_composer` is Post's. Reading the page alone reported it as a hole it
// is not.
const orphans = new Set();
for (const key of keys) {
  const [page, component, element] = key.split('/');
  const owned =
    (page !== '*' && pageOwner[page]) ||
    (component !== '*' && componentOwner[component]) ||
    (element !== '*' && elementOwner[element]);
  if (!owned) orphans.add(key);
}

if (stale.length) {
  console.error(
    `config-owners: ${stale.length} entr${stale.length > 1 ? 'ies' : 'y'} in ` +
      'OWNERLESS_ON_PURPOSE no longer apply — the page gained an owner, or left the ' +
      'config. Drop them, so the list keeps meaning what it says.\n\n' +
      stale.map((p) => `  ${p}`).join('\n') +
      '\n',
  );
  process.exit(1);
}

if (unexplained.length) {
  console.error(
    `config-owners: ${unexplained.length} page${unexplained.length > 1 ? 's' : ''} with no ` +
      'owner.\n' +
      'A page is the only segment with nothing above it, so nothing can withhold\n' +
      'this one — which reads exactly like a gate that works. Give it an owner in\n' +
      'AMITY_PAGE_MODULE, or add it to OWNERLESS_ON_PURPOSE in this file with the\n' +
      'reason.\n\n' +
      unexplained.map((p) => `  ${p}`).join('\n') +
      '\n',
  );
  process.exit(1);
}

console.log(
  `config-owners: clean (${pages.size} pages rendered or declared, ` +
    `${unowned.length} ownerless on purpose)`,
);

if (orphans.size) {
  console.log(
    `\n  ${orphans.size} config paths where no segment names a module, so nothing\n` +
      '  withholds them. Most are chrome and should stay that way; a real surface\n' +
      '  among them needs an owner of its own. Not failed — telling them apart\n' +
      '  needs a person.\n' +
      [...orphans]
        .sort()
        .map((o) => `    ${o}`)
        .join('\n'),
  );
}
