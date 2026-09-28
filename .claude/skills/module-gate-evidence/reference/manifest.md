# Manifest schema

The contract between the two stages. Both stages must agree on it and neither
the renderer nor a person may invent a field.

```jsonc
{
  "generatedAt": "2026-09-08T06:28:00.000Z",
  "source": "code",              // "code" | "code+app" once a browser stage has run
  "modules": ["community", "…"], // every module this build gates
  "surfaceTotals": [{ "kind": "page", "total": 78 }],
  "sdkTotal": 35,
  "runs": [ /* one per module, ordered by blast radius */ ]
}
```

## A run

Always present:

| field | meaning |
|---|---|
| `switched` | the module revoked in this run |
| `resolvesOff` | every module that resolves off as a result, the switched one included |
| `resolvesOn` | the rest — the counterpart assertion is written against these |

| `press` | what a person has to do to reach the assertions — the report prints it verbatim. The code run says there is nothing to press; a browser stage overwrites it with the address it actually opened, so a reader repeats the run by following a link |
| `surfaces[]` | `{ kind, total, gone[], remain }` per id table |
| `assertions.rows[]` | `{ id, kind, owner, must: "go" \| "remain", verdicts: {<column>: "pass" \| "fail" \| "vacuous"} }` — one column per independent scoring, `config` and `entitlement` in the code run, `desktop` and `mobile` in the browser run |
| `sdk` | `{ rows[], total, stopped, leak }` where a row is `{ name, owner, baseline, off, status }` and status is `stopped` \| `leak` \| `unchanged` \| `gone-other` |

Optional, added by a later stage:

| field | meaning |
|---|---|
| `shots[]` | `{ src, caption, viewport, baseline }`, `src` a data URI so the page is self-contained |
| `panelText` | `{ config, entitlement }` — the panel's own words, keyed by the source that drove the switches, which the renderer scores against `resolvesOff.length`. Only `entitlement` is read. A stage that already found one leaves it alone, so the panel story's reading is not overwritten by the app's |
| `network` | from a HAR, and it **replaces** `sdk` in the traffic table where it exists — "this endpoint was never asked for" outranks "this function would have been refused". `rows[]` carries the same shape as an `sdk` row, `{ name, owner, baseline, off, status }`, with `name` an endpoint path and `owner` a module or `"base layer"`. `quiet[]` and `leaks[]` are the `stopped` and `leak` names, and `topicLeaks[]` the realtime subscriptions a revoked module still opened |

## The traffic statuses

Read against a baseline where every module is granted:

| status | meaning |
|---|---|
| `stopped` | owned by a revoked module and no longer allowed — the evidence |
| `leak` | owned by a revoked module and still allowed — the gate did not hold |
| `gone-other` | no longer allowed but owned by a module still granted — a defect the other way |
| `unchanged` | the base layer, and the modules still on |

## Rules

- **`vacuous` is not a pass and not a failure.** The baseline never had the id,
  so its absence proves nothing. Keep it out of the pass rate and show it.
- **A leak outranks everything.** A request to a revoked module's endpoints
  means the gate did not hold, whatever the screen looked like.
- **Order runs by blast radius.** How much a module takes with it is the first
  thing anyone asks.
- **The limits are computed, not written.** The renderer decides what to list as
  uncovered from what the manifest carries. A report that grew a browser stage
  and kept printing "the rendered screen is not covered" teaches a reader to
  skip the appendix, which is where the evidence class lives.
