---
name: module-gate-evidence
description: Produce the QA evidence report for module entitlement — one run per module revoked, showing what the UIKit hides and what it stops calling. Use when asked for module-gate evidence, entitlement QA evidence, a "switching a module off" report, or proof that revoking a module actually removes its surfaces. Also use to regenerate that report after the gate, the id tables or the catalog change.
---

# Module gate evidence

A report that proves switching a module off actually removes it. Two stages, and
the split is the point: stage 1 measures and writes a manifest, stage 2 renders
the page from that manifest and touches no numbers of its own.

Never write a figure into the report by hand. A number a person can edit is not
evidence, and this report exists to be handed to someone who did not run it.

## Stage 1 — measure

### Code-level (works anywhere, no network, no browser)

```bash
MODULE_GATE_MANIFEST_OUT=./manifest.json npx jest moduleGateManifest
```

`src/v4/core/providers/CustomizationProvider/__tests__/moduleGateManifest.test.ts`
takes the shipped id tables and the shipped resolver, revokes one module at a
time in core's answer, and records what came off. It asserts both directions per
run — the revoked module must go, and no id owned by a still-granted module may
be hidden. Without that second assertion "everything disappeared" reads as a
pass.

It skips writing unless `MODULE_GATE_MANIFEST_OUT` is set, so an ordinary test
run does not litter.

### There is no browser run any more

It photographed the app once per module revoked, and nothing can revoke a
module now: the customer-side `features` block is gone from `Config`, and
standing in for the network's plan needed an override prop on
`AmityUIKitProvider` that was public API and was removed. Fifteen captures of
one state is not evidence, so `capture-app.mjs` and `capture-panel.mjs` are
deleted rather than left to produce it.

**Say so in the report.** A code run measures the _decision_ —
`isModuleExcluded` returning true proves the gate refused an id, not that the
id left the screen. That gap used to be closed by the browser run and is not
closed now.

The panel in the corner of a live story still reports what this network's plan
withheld, and is worth a screenshot when the question is about a real network
rather than a hypothetical one.

Restoring the browser run means giving a decorator a way into the provider's
entitlement. Seeding the react-query cache that `useNetworkEntitlement` reads
is the route that costs no public API: it needs `queryClient` exported from
`AmityUIKitProvider.tsx`, which does not reach `dist/index.d.ts` because
`src/index.ts` re-exports only that module's default.

## Stage 2 — render

```bash
node .claude/skills/module-gate-evidence/scripts/report.mjs \
  ./manifest.json ./report.html --title "Revoking a module" --ticket PDT-4648
```

`--title` names the page; keep it a short noun phrase, since it is also the
artifact's name in the gallery. `--ticket` sets the eyebrow and is optional.

Then publish `report.html` with the Artifact tool. Favicon 🧪 for this family of
reports, so they are recognisable in a gallery next to each other.

The renderer reads which manifest kind it has and renders the sections that kind
carries: surfaces and SDK gates for a code run, assertions, network and
screenshots for a browser run. Do not edit the HTML it writes — change the
manifest or the renderer, and regenerate.

## House style

The visual identity is fixed across this family of reports so two of them can be
read side by side: deep green accent on a cool off-white ground, Archivo for UI,
IBM Plex Mono for ids and paths, Source Serif 4 for the lede and the prose.
Summary tiles first, one section per run ordered by blast radius, appendix naming
what the run does not cover. It lives in `scripts/report.mjs`; change it there
rather than per report.

## What to say about limits

Say them, in the report, in the appendix — do not let the reader infer the
evidence class from what is missing. A code-level run proves what the UIKit
decides, which is the layer a wrong decision starts in, and nothing about pixels
or packets. A run against a fixture proves the rule, not a live network's plan.

The renderer writes that appendix from what the manifest carries, so the honest
version is the default and a stage that lands stops the report claiming the gap
it just closed. Do not restate those rows in prose above the appendix; when a
limit is worth more than a row, add it to `limitRows` in `scripts/report.mjs`
rather than to one report.
