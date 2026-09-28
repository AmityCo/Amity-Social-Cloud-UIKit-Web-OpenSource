#!/usr/bin/env node
/**
 * manifest -> evidence report, in the Engagement Fabric QA house style.
 *
 *   node report.mjs <manifest.json> <out.html> [--title "..."] [--ticket PDT-0000]
 *
 * Every figure on the page is derived from the manifest here. Nothing is passed
 * in as prose and nothing is typed into the template, because a report whose
 * numbers can be edited by hand is not evidence.
 *
 * The per-run shape is fixed and matches the browser run's: what you press,
 * then the assertions, then the traffic table, then the shots. A reader who
 * knows one of these reports can read any of them.
 */
import fs from 'fs';
import path from 'path';

const [manifestPath, outPath, ...rest] = process.argv.slice(2);

if (!manifestPath || !outPath) {
  console.error('usage: report.mjs <manifest.json> <out.html> [--title "..."] [--ticket PDT-0000]');
  process.exit(2);
}

const flag = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 && rest[i + 1] ? rest[i + 1] : fallback;
};

const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const TITLE = flag('title', 'Module Gate Evidence');
const TICKET = flag('ticket', '');

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const n = (x) => x.toLocaleString('en-US');
const label = (k) =>
  k
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
const slug = (k) => k.replace(/[^a-z0-9]+/gi, '-');

/** A capped id list with the count of what it left out — the browser run's
 *  "+42 more", which keeps a 260-entry list from burying the finding. */
const idList = (ids, cap = 12) => {
  if (ids.length === 0) return '<p class="clean">Nothing.</p>';
  const head = ids
    .slice(0, cap)
    .map((id) => `<li><code>${esc(id)}</code></li>`)
    .join('');
  const more = ids.length > cap ? `<li class="more">+${n(ids.length - cap)} more</li>` : '';

  return `<ul class="net">${head}${more}</ul>`;
};

/**
 * Walks, when a walk manifest is passed with `--walks`.
 *
 * A run photographs social home; a walk presses its way to a screen that home
 * cannot reach — a user profile, the composer's mention menu, livestream
 * setup. Those are the only evidence for modules whose surfaces are nowhere
 * near the first screen, and without them four runs in this report prove
 * nothing at all.
 *
 * Rows arrive one per (walk, off-set, viewport). They are paired here the way
 * the runs are: the baseline says the id was on the screen to begin with, and
 * the switched-off row says it left. A verdict from the second without the
 * first is the vacuous pass this whole report exists to avoid.
 */
const walkArg = process.argv.indexOf('--walks');
const walkRows =
  walkArg > -1 && process.argv[walkArg + 1]
    ? JSON.parse(fs.readFileSync(process.argv[walkArg + 1], 'utf8'))
    : [];

const walkDir =
  walkArg > -1 && process.argv[walkArg + 1]
    ? path.dirname(path.resolve(process.argv[walkArg + 1]))
    : null;

const shotUri = (ticket, name) => {
  if (!walkDir || !name) return null;
  try {
    const file = path.join(walkDir, ticket, name);
    return `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
  } catch {
    return null;
  }
};

const walkGroups = [...new Set(walkRows.map((r) => r.walk))].map((id) => {
  const rows = walkRows.filter((r) => r.walk === id);
  const base = rows.filter((r) => r.off.length === 0);
  const off = rows.filter((r) => r.off.length > 0);

  return { id, ticket: rows[0].ticket, switched: off[0]?.off ?? [], base, off, rows };
});

const runs = m.runs ?? [];
const surfaceTotals = m.surfaceTotals ?? [];
const idsPerRun = surfaceTotals.reduce((t, s) => t + s.total, 0);

/* ── Figures, all computed ───────────────────────────────────────────────── */
const decisions = runs.reduce(
  (t, r) => t + (r.surfaces ?? []).reduce((u, s) => u + s.gone.length + s.remain, 0),
  0,
);
const goneTotal = runs.reduce(
  (t, r) => t + (r.surfaces ?? []).reduce((u, s) => u + s.gone.length, 0),
  0,
);
const widest = runs.reduce(
  (w, r) => (r.resolvesOff.length > (w?.resolvesOff.length ?? 0) ? r : w),
  null,
);
const shots = runs.reduce((t, r) => t + (r.shots?.length ?? 0), 0);

const verdicts = runs.flatMap((r) =>
  (r.assertions?.rows ?? []).flatMap((row) => Object.values(row.verdicts ?? {})),
);
const passed = verdicts.filter((v) => v === 'pass').length;
const failed = verdicts.filter((v) => v === 'fail').length;
const vacuous = verdicts.filter((v) => v === 'vacuous').length;

/** Verdicts from the app run: what the screen actually did. */
const observed = runs.flatMap((r) =>
  (r.observed?.rows ?? []).flatMap((row) => Object.values(row.verdicts ?? {})),
);
const obsPass = observed.filter((v) => v === 'pass').length;
const obsFail = observed.filter((v) => v === 'fail').length;
const obsVacuous = observed.filter((v) => v === 'vacuous').length;

const stopped = runs.reduce((t, r) => t + (r.sdk?.stopped ?? 0), 0);
// The wire outranks the resolver: where a HAR exists it is the leak count, and
// `sdk` is what the code run could say instead.
const leaks = runs.reduce(
  (t, r) => t + (r.network?.rows ?? r.sdk?.rows ?? []).filter((s) => s.status === 'leak').length,
  0,
);

/**
 * The panel's own count, against the count the resolver produced.
 *
 * The panel is drawn in a browser from the shipped component; the manifest is
 * computed in a test runner from the shipped resolver. Two renderings of one
 * rule, so a disagreement means one of them is lying — worth more than either
 * figure on its own.
 */
const panelCheck = (r) => {
  const text = r.panelText?.entitlement;
  if (!text) return null;
  const claimed = Number(/^(\d+) of \d+ modules off/.exec(text)?.[1]);

  return { claimed, expected: r.resolvesOff.length, agrees: claimed === r.resolvesOff.length };
};
const checks = runs.map(panelCheck).filter(Boolean);
const agreed = checks.filter((c) => c.agrees).length;

/**
 * The limits are the report, as much as the numbers are. So they are computed
 * from what the manifest actually carries rather than written once: a run that
 * grew a browser stage and then kept printing "the rendered screen is not
 * covered" trains a reader to skip the appendix, and the appendix is where the
 * evidence class lives.
 */
const sawScreen = runs.some((r) => r.observed?.rows?.length);
/**
 * Runs that proved nothing, named rather than left to look clean.
 *
 * Kept for a manifest that carries runs from elsewhere. A run that opens one
 * story leaves a module whose surfaces live on another — chat's do — scoring
 * every assertion vacuous with no endpoint going quiet, and "0 leaks" on that
 * row reads exactly like a gate that held. It is a coverage gap, and the reader
 * has to be told which modules it covers.
 */
const unproven = runs
  .filter(
    (r) =>
      r.observed?.rows?.length &&
      !(r.observed.rows ?? []).some((row) => Object.values(row.verdicts).includes('pass')) &&
      !(r.network?.quiet ?? []).length,
  )
  .map((r) => r.switched);
const sawWire = runs.some((r) => r.network?.rows?.length);
// Topics *seen*, not topics leaked: an empty leak list is the gate holding, and
// an empty observation is a check that did not run. Only the first earns the
// stronger appendix row.
const sawTopics = runs.some((r) => (r.network?.topicsSeen ?? 0) > 0);

const limitsLede = sawWire
  ? 'These runs reach the screen and the wire. What is left is the plan behind them: ' +
    'the grants are a fixture, so this proves the rule rather than any one network\u2019s purchase.'
  : 'A code-level run proves what the UIKit decides, which is the layer a wrong decision ' +
    'starts in \u2014 not that the screen is empty and not that the socket went quiet.';

const limitRows = [
  ...(sawScreen
    ? []
    : [
        [
          'the rendered screen',
          'nothing here. The browser run that covered it photographed the app once per module revoked, ' +
            'and nothing can revoke a module any more \u2014 the customer-side switch is gone from the config ' +
            'and the provider takes no entitlement override. The gap is real and unclosed.',
        ],
      ]),
  ...(sawWire
    ? [
        [
          'request bodies, and reads that ride another module\u2019s route',
          'the HAR is matched on path and on the one query field that carries ownership ' +
            '(<code>dataTypes</code>). A module borrowing a route under some other parameter would be ' +
            'scored as its host\u2019s traffic.',
        ],
      ]
    : [
        [
          'the wire',
          'a HAR per run, diffed against that baseline. The traffic table is the gate\u2019s answer about ' +
            'SDK functions, so it proves the request would be refused, not that none was made.',
        ],
      ]),
  ...(sawTopics
    ? [
        [
          'realtime, past the subscriptions',
          'Playwright records no WebSocket traffic, so the topics here come off the SDK\u2019s own log ' +
            'lines. That catches a revoked module that still subscribes; it says nothing about what ' +
            'arrived on a topic that was allowed.',
        ],
      ]
    : [
        [
          'MQTT',
          'nothing here or in a HAR: Playwright records no WebSocket traffic, so the realtime half of the ' +
            'deny list is untested on every platform.',
        ],
      ]),
  ...(unproven.length
    ? [
        [
          `the ${unproven.length === 1 ? 'run' : 'runs'} for ${unproven
            .map((k) => `<code>${esc(k)}</code>`)
            .join(', ')}`,
          'a run against the story those surfaces live on. This pass opens one story, so a module with ' +
            'nothing on it scores every assertion vacuous and shows no endpoint going quiet \u2014 which ' +
            'reads like a gate that held and is not evidence of one. Point <code>APP_STORY</code> at the ' +
            'other story and capture again.',
        ],
      ]
    : []),
  [
    'ids the UIKit does not declare',
    'nothing can: an id absent from the tables has no owner, so it is neither hidden nor kept, and no ' +
      'assertion on it can fail.',
  ],
  [
    'a live network\u2019s real plan',
    'the entitlement read against a network whose grants are set. Every run here uses the full-catalog ' +
      'fixture with one grant flipped, which is also what keeps the runs comparable to each other.',
  ],
  [
    'whether the page really stopped rendering',
    'a code run measures the decision, not the render. `isModuleExcluded` returning true is proof the ' +
      'gate said no; a page that never asks is hidden in this table and on screen anyway. At least the ' +
      'events pages do exactly that \u2014 the page hook is called and its exclusion flag dropped \u2014 so read a ' +
      'surface row as \u201cthe gate refuses it\u201d and no further. Nothing in this report says \u201cit is not on ' +
      'the screen\u201d.',
  ],
  [
    'a network core has not answered for',
    'the bundle rules are <code>catalog.requires</code>, so a failed read or a core too old to answer ' +
      'leaves every module resolving on its own flag with nothing cascading. ' +
      '<code>moduleEntitlementLive</code> prints what a real network says the rules are, and fails if ' +
      'core does not carry a module this build gates.',
  ],
];

const tiles = [
  [n(runs.length), 'runs, one per module'],
  [n(idsPerRun), 'ids declared per run'],
  [n(decisions), 'gate decisions measured'],
  ...(observed.length
    ? [
        [n(obsPass), 'seen gone on screen'],
        [n(obsFail), 'still on screen', obsFail === 0],
        [n(obsVacuous), 'vacuous'],
      ]
    : []),
  [n(passed), 'assertions passed'],
  [n(failed), 'failed', failed === 0],
  [n(leaks), 'gate leaks', leaks === 0],
  vacuous ? [n(vacuous), 'vacuous'] : null,
  [n(stopped), 'SDK entries stopped'],
  widest
    ? [
        `${widest.resolvesOff.length}<span class="of">/${runs.length}</span>`,
        `widest cascade · ${label(widest.switched)}`,
      ]
    : null,
  shots ? [n(shots), 'screenshots'] : null,
  checks.length
    ? [
        `${n(agreed)}<span class="of">/${n(checks.length)}</span>`,
        'panel agrees with the resolver',
        agreed === checks.length,
      ]
    : null,
].filter(Boolean);

/* ── Per-run section ─────────────────────────────────────────────────────── */
const dot = (on, status) =>
  on
    ? `<span class="dot d-yes${status === 'leak' ? ' bad' : ''}">●</span>`
    : `<span class="dot d-no${status === 'stopped' ? ' good' : ''}">○</span>`;

const STATUS_LABEL = { 'gone-other': 'gone' };

const trafficTable = (r) => {
  // A HAR replaces the resolver's answer where there is one: "this endpoint was
  // never asked for" is a stronger statement than "this function would have
  // been refused". The two share a row shape so the table does not fork.
  const wire = Boolean(r.network?.rows?.length);
  const rows = wire ? r.network.rows : r.sdk?.rows;
  if (!rows?.length) return '';

  const leaked = rows.filter((s) => s.status === 'leak').length;
  const moved = rows.filter((s) => s.status !== 'unchanged');
  const same = rows.filter((s) => s.status === 'unchanged');
  const row = (s) => `<tr>
          <td class="p">${esc(s.name)}</td>
          <td class="o">${esc(s.owner)}</td>
          <td class="c">${dot(s.baseline, s.status)}</td>
          <td class="c">${dot(s.off, s.status)}</td>
          <td><span class="st st-${esc(s.status)}">${esc(STATUS_LABEL[s.status] ?? s.status)}</span></td>
        </tr>`;

  const topicLeaks = r.network?.topicLeaks ?? [];

  return `
      <h4>Traffic · what the gate refuses</h4>
      ${
        leaked
          ? `<p class="bad-line">${n(leaked)} owned by a revoked module and still ${
              wire ? 'requested' : 'allowed'
            }.</p>`
          : `<p class="clean">Nothing owned by a revoked module is still ${
              wire ? 'requested' : 'allowed'
            }.</p>`
      }
      ${
        topicLeaks.length
          ? `<p class="bad-line">${n(topicLeaks.length)} realtime ${
              topicLeaks.length === 1 ? 'topic' : 'topics'
            } still subscribed: ${topicLeaks.map(esc).join(', ')}</p>`
          : ''
      }
      <div class="scroller"><table class="cmp">
        <thead><tr>
          <th>${wire ? 'endpoint' : 'sdk function'}</th><th>owner</th>
          <th class="c">baseline</th><th class="c">${esc(r.switched)} off</th><th>status</th>
        </tr></thead>
        <tbody>${moved.map(row).join('')}</tbody>
      </table></div>
      ${
        same.length
          ? `<details class="rowmore"><summary>+${n(same.length)} unchanged ${
              same.length === 1 ? 'row' : 'rows'
            } — ${wire ? 'the base layer and the modules still granted' : 'owned by a module still granted'}</summary>
        <div class="scroller"><table class="cmp"><tbody>${same.map(row).join('')}</tbody></table></div>
      </details>`
          : ''
      }`;
};

const assertionTable = (r) => {
  // The app run wins where it exists: an id seen to leave the screen is a
  // stronger statement than an id the resolver would have hidden.
  const seenRows = r.observed?.rows ?? [];
  // Only the ids the baseline could speak to. A stubbed app shows its chrome
  // and little else, so most declared ids are vacuous on every viewport, and
  // printing 250 rows of "proves nothing" buries the handful that do.
  const withEvidence = seenRows.filter((row) =>
    Object.values(row.verdicts).some((v) => v !== 'vacuous'),
  );
  const rows = withEvidence.length ? withEvidence : r.assertions?.rows;
  if (!rows?.length) return '';
  const hidden = seenRows.length - withEvidence.length;

  const cols = Object.keys(rows[0].verdicts);
  const resolver = r.assertions?.rows ?? [];
  const agreed = resolver.every((row) => !Object.values(row.verdicts).includes('fail'));
  const note =
    withEvidence.length && resolver.length
      ? `<p class="foot">${n(hidden)} more declared ids resolve off in this run and the baseline
        never showed any of them, so nothing on screen can prove it either way — vacuous, and
        counted apart. The resolver was asked about ${n(resolver.length)} of them by config and by
        grant and ${agreed ? 'agreed every time' : 'disagreed — see the manifest'}.</p>`
      : resolver.length
        ? `<p class="foot">Scored by the resolver rather than seen: this run has no app capture.</p>`
        : '';

  return `
          <h4>Assertions</h4>
          <table class="verd">
            <thead><tr><th>id</th><th>must</th>${cols
              .map((c) => `<th>${esc(c)}</th>`)
              .join('')}</tr></thead>
            <tbody>${rows
              .map(
                (row) => `<tr>
              <td><code>${esc(row.id)}</code><span class="owner">${esc(row.owner ?? '')}</span></td>
              <td class="must">${esc(row.must)}</td>
              ${cols
                .map(
                  (c) =>
                    `<td><span class="v ${esc(row.verdicts[c])}">${esc(row.verdicts[c])}</span></td>`,
                )
                .join('')}
            </tr>`,
              )
              .join('')}</tbody>
          </table>${note}`;
};

/**
 * Baseline beside off, in one row, for each viewport.
 *
 * The baseline used to sit in a section of its own at the top of the page, so
 * telling what a run actually changed meant scrolling between two screens and
 * holding one in your head. Read side by side it is one glance, which is the
 * only way a screenshot pair carries an argument.
 *
 * The baseline image is painted from a class rather than repeated inline. Its
 * data URI is a few hundred kilobytes and there are fifteen runs; written out
 * each time it would be most of the file, and the file has to stay under the
 * artifact limit. Declared once in the stylesheet, it is stored once.
 */
const baselineByViewport = new Map((m.baselineShots ?? []).map((s) => [s.viewport, s]));

/**
 * One rule per viewport, carrying that baseline's pixels once.
 *
 * `aspect-ratio` reserves the box from the size the capture actually used, so
 * a painted baseline occupies exactly what the `<img>` beside it does and the
 * pair lines up before either has loaded.
 */
const baselineCss = (m.baselineShots ?? [])
  .map(
    (s) =>
      `.b-${s.viewport}{background-image:url(${s.src});` +
      `aspect-ratio:${s.width ?? 1440}/${s.height ?? 960}}`,
  )
  .join('\n');

const pairedShots = (shots) =>
  shots
    .map((s) => {
      const base = baselineByViewport.get(s.viewport);

      return `${
        base
          ? `<figure class="base">
            <div class="painted b-${esc(s.viewport)}" role="img" aria-label="${esc(base.caption)}"></div>
            <figcaption>baseline<span>${esc(s.viewport ?? '')}</span></figcaption>
          </figure>`
          : ''
      }<figure class="off">
            <!-- The box is reserved from the viewport the capture used. Lazily
                 loaded and unsized, this img was 45px tall until it scrolled
                 into view, so the pair it is half of did not line up until
                 the reader had already passed it. -->
            <img loading="lazy"${base ? ` style="aspect-ratio:${base.width ?? 1440}/${base.height ?? 960}"` : ''} src="${esc(s.src)}" alt="${esc(s.caption)}">
            <figcaption>${esc(s.caption)}<span>${esc(s.viewport ?? '')}</span></figcaption>
          </figure>`;
    })
    .join('');

/** One walk: what was pressed, what the baseline showed, what the switch took. */
const walkSection = (g) => {
  const ids = [...new Set(g.rows.flatMap((r) => (r.absent ?? []).map((a) => a.id)))];
  const labels = [...new Set(g.rows.flatMap((r) => (r.absentText ?? []).map((a) => a.label)))];
  const viewports = [...new Set(g.rows.map((r) => r.viewport))];

  const seen = (row, id, isLabel) => {
    const list = isLabel ? row?.absentText ?? [] : row?.absent ?? [];

    return list.find((a) => (isLabel ? a.label : a.id) === id);
  };

  /**
   * `baseline` decides what the off column is allowed to claim.
   *
   * An id the baseline never showed cannot count as one the switch removed —
   * it reads as a pass while proving nothing, which is the failure this whole
   * report is built to avoid. So the off column says `vacuous` there, in the
   * muted style, rather than the `gone` it says where the baseline had it.
   * The rows stay either way: an id worth asserting is worth seeing the
   * verdict on, and "we did not manage to make this appear" is itself a
   * finding about the walk.
   */
  const verdict = (row, id, isLabel, baseline) => {
    if (!row) return '<td class="v na">—</td>';
    if (!row.reachedEnd) return '<td class="v na">walk stopped</td>';
    const hit = seen(row, id, isLabel);
    if (!hit) return '<td class="v na">—</td>';
    if (!hit.gone) return '<td class="v there">on screen</td>';

    const inBaseline = baseline && seen(baseline, id, isLabel);
    const baselineHadIt = inBaseline && !inBaseline.gone;

    return baseline && !baselineHadIt
      ? '<td class="v vac">vacuous</td>'
      : '<td class="v gone">gone</td>';
  };

  const rowFor = (id, isLabel) =>
    `<tr><td class="id">${esc(id)}${isLabel ? ' <span class="lbltag">label</span>' : ''}</td>` +
    viewports
      .map((vp) => {
        const b = g.base.find((r) => r.viewport === vp);
        const o = g.off.find((r) => r.viewport === vp);

        return verdict(b, id, isLabel) + verdict(o, id, isLabel, b);
      })
      .join('') +
    '</tr>';

  const controls = [...new Set(g.rows.flatMap((r) => (r.present ?? []).map((p) => p.id)))];
  const controlsHeld = g.off.every((r) => (r.present ?? []).every((p) => p.there));

  const press = (g.base[0]?.stops ?? [])
    .filter((st) => st.selector !== '(skipped)')
    .map((st, i) => `${i + 1}. ${st.step.replace(/-/g, ' ')} → ${st.selector}`)
    .join('\n');

  const shots = g.rows
    .flatMap((r) => {
      const last = (r.stops ?? []).filter((st) => st.screenshot).slice(-1)[0];
      const src = last && shotUri(r.ticket, last.screenshot);

      return src
        ? [
            {
              src,
              cap: `${r.viewport} · ${r.off.length ? `${r.off.join(' + ')} off` : 'baseline'}`,
              base: r.off.length === 0,
            },
          ]
        : [];
    })
    .sort((a, b) => (a.cap < b.cap ? -1 : 1));

  return `
  <section id="walk-${slug(g.id)}">
    <div class="sec-h">
      <p class="eyebrow">${esc(g.ticket)} · walk</p>
      <h2>${esc(g.id.replace(/-/g, ' '))}</h2>
      <p class="bundle">switch: ${g.switched.map((x) => `<code>${esc(x)}</code>`).join(' ')}
      · ${viewports.map((v) => `<code>${esc(v)}</code>`).join(' ')}
      · controls ${controlsHeld ? 'held' : '<b>missing</b>'}</p>
    </div>
    <article class="run">
      <div class="cols">
        <div>
          <p class="lbl">What you press</p>
          <pre class="cmd">${esc(press || 'nothing — the walk did not start')}</pre>
          <p class="lbl">Still there afterwards</p>
          ${idList(controls, 8)}
        </div>
        <div>
          <div class="tablewrap"><table class="ex">
            <thead><tr><th>id</th>${viewports.map((v) => `<th colspan="2">${esc(v)}</th>`).join('')}</tr>
            <tr><th></th>${viewports.map(() => '<th class="sub">baseline</th><th class="sub">off</th>').join('')}</tr></thead>
            <tbody>${ids.map((id) => rowFor(id, false)).join('')}${labels.map((l) => rowFor(l, true)).join('')}</tbody>
          </table></div>
        </div>
      </div>
      ${shots.length ? `<div class="shots">${shots.map((sh) => `<figure class="${sh.base ? 'base' : 'off'}"><img loading="lazy" src="${sh.src}" alt="${esc(sh.cap)}"><figcaption>${esc(sh.cap)}</figcaption></figure>`).join('')}</div>` : ''}
    </article>
  </section>`;
};

const section = (r) => {
  const off = r.resolvesOff.filter((k) => k !== r.switched);
  const check = panelCheck(r);

  return `
  <section id="${slug(r.switched)}">
    <div class="sec-h">
      ${TICKET ? `<p class="eyebrow">${esc(TICKET)}</p>` : ''}
      <h2>${esc(label(r.switched))} off</h2>
      <p class="bundle">Resolves off: ${r.resolvesOff
        .map((k) => `<code>${esc(k)}</code>`)
        .join(' ')}</p>
    </div>

    <article class="run">
      <header class="run-h">
        <code>modules.${esc(r.switched)} = false</code>
        <span class="sw">switch: <b>${esc(r.switched)}</b></span>
        <span class="sw">resolves ${n(r.resolvesOff.length)} of ${n(
          m.modules?.length ?? runs.length,
        )} off</span>
        ${
          check
            ? `<span class="sw">panel says <b>${n(check.claimed)}</b> · <span class="v ${
                check.agrees ? 'pass' : 'fail'
              }">${check.agrees ? 'agrees' : 'disagrees'}</span></span>`
            : ''
        }
      </header>

      <div class="how"><h4>What you press</h4><pre>${esc(
        r.press ?? 'Nothing — the assertions are on the screen the run opens.',
      )}</pre></div>

      <div class="cols">
        <div>${assertionTable(r)}</div>
        <div>
          <h4>Surfaces gone</h4>
          ${(r.surfaces ?? [])
            .map(
              (s) => `<p class="lbl">${esc(s.kind)}s · ${n(s.gone.length)} of ${n(s.total)}</p>
              ${idList(s.gone)}`,
            )
            .join('')}
        </div>
      </div>

      <div class="traffic">${trafficTable(r)}</div>

      ${
        off.length
          ? `<p class="cascade">${
              off.length === 1 ? 'One module' : `${n(off.length)} modules`
            } came off with it, each held by a prerequisite the catalog names: ${off
              .map((k) => `<code>${esc(k)}</code>`)
              .join(' ')}</p>`
          : '<p class="cascade">Nothing came off with it — no module lists it as a prerequisite.</p>'
      }

      ${r.shots?.length ? `<div class="shots">${pairedShots(r.shots)}</div>` : ''}
    </article>
  </section>`;
};

/* ── Page ────────────────────────────────────────────────────────────────── */
const html = `<title>${esc(TITLE)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">
<style>
:root {
  --ground:#f6f8f5; --surface:#ffffff; --sunk:#eef2ee; --sunk-2:#e4eae5;
  --ink:#141a16; --muted:#5c6b62; --line:#dfe6e0; --line-strong:#c8d3ca;
  --accent:#0e6b4d; --accent-soft:#e2efe9;
  --ok:#2f7d52; --ok-soft:#e4f1ea; --thin:#8a6a1c; --bad:#a33228; --bad-soft:#f7e9e7;
  --ui:Archivo,"Helvetica Neue",Arial,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
  --serif:"Source Serif 4",Georgia,serif;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --ground:#0f1411; --surface:#161c18; --sunk:#11170f; --sunk-2:#1c241e;
  --ink:#e4ebe6; --muted:#93a29a; --line:#28322c; --line-strong:#3a4740;
  --accent:#4cbf92; --accent-soft:#162b23;
  --ok:#5fbd8b; --ok-soft:#152a21; --thin:#c9a44e; --bad:#e0796d; --bad-soft:#2c1d1b;
}}
:root[data-theme="dark"]{
  --ground:#0f1411; --surface:#161c18; --sunk:#11170f; --sunk-2:#1c241e;
  --ink:#e4ebe6; --muted:#93a29a; --line:#28322c; --line-strong:#3a4740;
  --accent:#4cbf92; --accent-soft:#162b23;
  --ok:#5fbd8b; --ok-soft:#152a21; --thin:#c9a44e; --bad:#e0796d; --bad-soft:#2c1d1b;
}
*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);font-family:var(--ui);line-height:1.5}
code,pre{font-family:var(--mono)}
.wrap{display:grid;grid-template-columns:208px minmax(0,1fr);gap:40px;max-width:1180px;margin:0 auto;padding:36px 24px 96px}
nav{position:sticky;top:24px;align-self:start;display:flex;flex-direction:column;gap:2px;font-size:13px;max-height:calc(100vh - 48px);overflow-y:auto}
nav a{color:var(--muted);text-decoration:none;padding:4px 8px;border-radius:3px;border-left:2px solid transparent}
nav a:hover,nav a:focus-visible{color:var(--ink);background:var(--sunk);border-left-color:var(--accent);outline:none}
nav .navlbl{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:16px 0 4px 8px;font-weight:600}
h1{font-size:30px;font-weight:700;letter-spacing:-.02em;margin:0 0 6px;text-wrap:balance}
.lede{font-family:var(--serif);font-size:16.5px;color:var(--muted);max-width:62ch;margin:0 0 28px}
.eyebrow{font-family:var(--mono);font-size:11.5px;letter-spacing:.08em;color:var(--accent);text-transform:uppercase;margin:0 0 2px}
h2{font-size:22px;font-weight:600;margin:0 0 4px;letter-spacing:-.01em}
h4{font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:0 0 8px}
section{margin-bottom:56px;scroll-margin-top:24px}
.sec-h{border-bottom:2px solid var(--ink);padding-bottom:10px;margin-bottom:18px}
.bundle{margin:6px 0 0;font-size:12px;color:var(--muted)}
.bundle code{background:var(--sunk);padding:1px 5px;border-radius:2px;font-size:11.5px}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(124px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin:0 0 24px}
.tile{background:var(--surface);padding:14px 16px}
.tile b{display:block;font-size:26px;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.02em;line-height:1.1}
.tile b .of{font-size:15px;color:var(--muted)}
.tile span{font-size:11.5px;color:var(--muted)}
.tile.zero b{color:var(--ok)}
.run{border:1px solid var(--line);background:var(--surface);margin-bottom:20px}
.run-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:14px;padding:11px 16px;border-bottom:1px solid var(--line);background:var(--sunk)}
.run-h code{font-size:13px;font-weight:500}
.sw{font-size:11.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.how{padding:14px 16px 0}
.how pre{background:var(--sunk);border-left:2px solid var(--accent);padding:10px 12px;margin:0;font-size:12.5px;overflow-x:auto;white-space:pre-wrap}
.cols{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:28px;padding:16px}
.traffic{padding:0 16px 4px}
.cascade{margin:0;padding:0 16px 16px;font-size:12px;color:var(--muted)}
.cascade code{background:var(--sunk);padding:1px 5px;border-radius:2px;font-size:11.5px}
table.verd{width:100%;border-collapse:collapse;font-size:12.5px}
table.verd th{text-align:left;font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);font-weight:600;padding:0 8px 6px 0;border-bottom:1px solid var(--line)}
table.verd td{padding:5px 8px 5px 0;border-bottom:1px solid var(--line);vertical-align:baseline}
table.verd tr:last-child td{border-bottom:none}
table.verd code{font-size:11.5px;overflow-wrap:anywhere}
.owner{display:block;font-family:var(--mono);font-size:9.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
.must{color:var(--muted);font-size:11px}
.v{font-size:10.5px;font-weight:600;letter-spacing:.04em}
.v.pass{color:var(--ok)}.v.fail{color:var(--bad)}.v.vacuous{color:var(--thin)}
ul.net{list-style:none;margin:0 0 10px;padding:0;font-size:11.5px}
ul.net li{padding:2px 0;border-bottom:1px dotted var(--line);overflow-wrap:anywhere}
.more{color:var(--muted)}
.clean{font-size:12.5px;color:var(--ok);margin:0 0 10px;font-weight:500}
.bad-line{font-size:12.5px;color:var(--bad);margin:0 0 10px;font-weight:600}
.lbl{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);margin:10px 0 6px;font-weight:600}
.scroller{overflow-x:auto;border:1px solid var(--line)}
table.cmp{width:100%;border-collapse:collapse;font-size:12.5px;background:var(--surface)}
table.cmp th{text-align:left;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:8px 10px;border-bottom:1px solid var(--line-strong);white-space:nowrap}
table.cmp th.c,table.cmp td.c{text-align:center;width:84px}
table.cmp td{padding:6px 10px;border-bottom:1px solid var(--line);vertical-align:middle}
table.cmp tr:last-child td{border-bottom:none}
table.cmp td.p{font-family:var(--mono);font-size:11.5px;white-space:nowrap}
table.cmp td.o{font-family:var(--mono);font-size:10px;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);white-space:nowrap;width:130px}
.dot{font-family:var(--mono);font-size:13px;font-weight:600}
.d-yes{color:var(--muted)}
.d-no{color:var(--line-strong)}
.d-yes.bad{color:var(--bad)}
.d-no.good{color:var(--ok)}
.st{font-family:var(--mono);font-size:9.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:2px 6px;border-radius:2px;white-space:nowrap}
.st-stopped{background:var(--ok-soft);color:var(--ok)}
.st-leak{background:var(--bad-soft);color:var(--bad)}
.st-unchanged{background:var(--sunk-2);color:var(--muted)}
.st-gone-other{background:var(--accent-soft);color:var(--accent)}
.rowmore{margin-top:8px}
.rowmore summary{font-family:var(--mono);font-size:11px;color:var(--accent);cursor:pointer;padding:6px 0}
.rowmore summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
/* Four across: each viewport contributes a baseline-and-off pair, so one run
   is one row. Aligned to the start because a desktop shot is a third the
   height of a mobile one, and stretching the short pair to match leaves a
   dead panel under it. */
/* Two by two: a row per viewport, baseline beside off. The pair is the
   comparison, so it stays on one line; the viewports are separate questions,
   so they stack. Four across fitted the same run in one row and left each
   shot a quarter of the column — enough to see a chip leave a tab row, not
   enough to read one. */
.shots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:1px;background:var(--line);border-top:1px solid var(--line)}
/* The baseline is the left of each pair, sunk so the eye starts there. */
.shots figure:nth-child(2n+1){background:var(--sunk)}
.painted{background-repeat:no-repeat;background-position:top center;background-size:100% auto;border:1px solid var(--line)}
@media (max-width:720px){.shots{grid-template-columns:minmax(0,1fr)}}
figure{margin:0;background:var(--surface);padding:10px}
figure img{display:block;width:100%;height:auto;object-fit:cover;object-position:top center;border:1px solid var(--line)}
figcaption{font-size:11px;color:var(--muted);padding-top:6px;display:flex;justify-content:space-between;gap:8px}
figcaption span{font-family:var(--mono);font-size:10px}
figure.off figcaption{color:var(--ink);font-weight:600}
.tablewrap{overflow-x:auto}
table.ex th.sub{font-size:9.5px;letter-spacing:.06em;color:var(--muted);border-bottom:1px solid var(--line);font-weight:500}
table.ex td.v{font-family:var(--mono);font-size:11.5px;white-space:nowrap}
table.ex td.v.gone{color:var(--accent);font-weight:600}
table.ex td.v.there{color:var(--ink);font-weight:600}
table.ex td.v.na{color:var(--muted)}
table.ex td.v.vac{color:var(--muted);font-style:italic}
.lbltag{font-family:var(--ui);font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
nav .navlbl{font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);margin:14px 0 4px;font-weight:600}
.prose{font-family:var(--serif);font-size:15.5px;max-width:64ch}
.prose p{margin:0 0 14px}
.prose code{font-size:13px;background:var(--sunk);padding:1px 4px}
table.ex{width:100%;border-collapse:collapse;font-size:12.5px;background:var(--surface)}
table.ex th{text-align:left;font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);font-weight:600;padding:8px 10px;border-bottom:1px solid var(--ink)}
table.ex td{padding:7px 10px;border-bottom:1px solid var(--line);vertical-align:top}
table.ex td:first-child{font-family:var(--mono);white-space:nowrap}
dl.files{font-size:12.5px;margin:16px 0 0}
dl.files dt{font-family:var(--mono);font-size:12px;margin-top:10px}
dl.files dd{margin:2px 0 0;color:var(--muted)}
pre.cmd{background:var(--sunk);border-left:2px solid var(--accent);padding:10px 12px;margin:0 0 8px;font-size:12.5px;overflow-x:auto;white-space:pre-wrap}
footer{color:var(--muted);font-size:12px;border-top:1px solid var(--line);padding-top:14px}
@media (max-width:900px){.cols,.wrap{grid-template-columns:minmax(0,1fr)}nav{position:static;max-height:none}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
${baselineCss}
</style>

<div class="wrap">
<nav>
  <a href="#top">Summary</a>
  ${m.baselineShots?.length ? '<a href="#baseline">Baseline</a>' : ''}
  ${walkGroups.length ? '<p class="navlbl">Walks</p>' : ''}
  ${walkGroups.map((g) => `<a href="#walk-${slug(g.id)}">${esc(g.id.replace(/-/g, ' '))}</a>`).join('')}
  <p class="navlbl">Runs</p>
  ${runs.map((r) => `<a href="#${slug(r.switched)}">${esc(label(r.switched))}</a>`).join('\n  ')}
  <p class="navlbl">Appendix</p>
  <a href="#limits">What this does not cover</a>
  <a href="#method">Method and files</a>
</nav>

<main>
<div id="top">
  <p class="eyebrow">${TICKET ? `${esc(TICKET)} · ` : ''}Web UIKit</p>
  <h1>${esc(TITLE)}</h1>
  <p class="lede">Every figure on this page is computed from the run manifest, not typed. One run per
  module, each revoking that module in core’s answer and recording what the shipped resolver then hides —
  every page, component and element id the UIKit declares, and every SDK function the gate refuses.</p>

  <div class="tiles">
    ${tiles
      .map(
        ([v, l, zero]) =>
          `<div class="tile${zero ? ' zero' : ''}"><b>${v}</b><span>${esc(l)}</span></div>`,
      )
      .join('\n    ')}
  </div>

  <div class="prose">
    <p><b>How to read a verdict.</b> <span class="v pass">pass</span> means the id did what it must —
    gone for a <code>go</code> row, still there for a <code>remain</code> row. Each is scored twice, once
    against the customer’s config and once against core’s grant, because those are two separate routes to
    the same blank screen and a report that cannot tell them apart is no use when one of them breaks. A
    <code>remain</code> row is what stops “everything disappeared” from reading as a pass.</p>
    <p><b>How to read the traffic table.</b> <span class="st st-stopped">stopped</span> is owned by a
    revoked module and the gate now refuses it — the evidence.
    <span class="st st-gone-other">gone</span> is refused but owned by a module still granted, which would
    be a defect. <span class="st st-leak">leak</span> is owned by a revoked module and still allowed: the
    gate not holding. <span class="st st-unchanged">unchanged</span> is the base layer and the modules
    still on.</p>
    ${
      observed.length
        ? `<p><b>Seen, not merely decided.</b> The assertion columns are two viewports of the running
    app, and an id counts as present only with a non-zero box and neither <code>display:none</code>
    nor <code>visibility:hidden</code> — a presence-only reading passes a 0×0 button that should
    have failed. <span class="v vacuous">vacuous</span> means the baseline never showed the id, so
    its absence proves nothing; those are counted apart from the passes, because a vacuous
    assertion reads as coverage. The session is stubbed, so the lists are empty in the baseline
    too: what these shots carry is the chrome — the tabs, the rail, the create buttons — which is
    where a gate is visible.</p>`
        : ''
    }
    ${
      shots && !observed.length
        ? `<p><b>The two figures per run.</b> The manifest is computed in a test runner from the shipped
    resolver; the panel photographed below each run is drawn in a browser by the shipped component, reading
    the same catalog through the same functions. Independent renderings of one rule, so the column that
    matters is whether they agree — a screenshot on its own only shows that something rendered.</p>`
        : ''
    }
  </div>
</div>

${
  m.baselineShots?.length
    ? `<section id="baseline">
  <div class="sec-h">
    <h2>Baseline</h2>
    <p class="bundle">Every module granted. Each run below is scored against this and shows it
    again beside its own screen, so an id the baseline never carried cannot count as one that
    disappeared.</p>
  </div>
  <article class="run">
    <div class="shots">${m.baselineShots
      .map(
        (s) => `<figure class="base">
        <div class="painted b-${esc(s.viewport)}" role="img" aria-label="${esc(s.caption)}"></div>
        <figcaption>${esc(s.caption)}<span>${esc(s.viewport ?? '')}</span></figcaption>
      </figure>`,
      )
      .join('')}</div>
  </article>
</section>`
    : ''
}

${runs.map(section).join('\n')}

${walkGroups.map(walkSection).join('\n')}

<section id="limits">
  <div class="sec-h">
    <p class="eyebrow">Appendix</p>
    <h2>What this does not cover</h2>
    <p class="bundle">${limitsLede}</p>
  </div>
  <table class="ex">
    <thead><tr><th>not covered</th><th>what would cover it</th></tr></thead>
    <tbody>
      ${limitRows.map(([what, cover]) => `<tr><td>${what}</td><td>${cover}</td></tr>`).join('')}
    </tbody>
  </table>
</section>

<section id="method">
  <div class="sec-h">
    <p class="eyebrow">Appendix</p>
    <h2>Method and files</h2>
  </div>
  <div class="prose">
    <p><b>Two stages, and the split is the point.</b> The first measures and writes a manifest; the second
    renders this page from it and holds no figures of its own. Nothing on the page can be corrected by
    editing the page.</p>
    <p><b>The resolver, not a copy of it.</b> The run calls <code>isFeatureEnabled</code> and
    <code>isModuleExcluded</code> — the functions <code>CustomizationProvider</code> itself calls. A
    reimplementation would stay green while the real one drifted.</p>
    <p><b>Ordered by blast radius.</b> How much a module takes with it is the first thing anyone asks, so
    the runs are sorted by it rather than alphabetically.</p>
  </div>
  <pre class="cmd">MODULE_GATE_MANIFEST_OUT=./manifest.json npx jest moduleGateManifest
node .claude/skills/module-gate-evidence/scripts/report.mjs ./manifest.json ./report.html \\
  --title ${JSON.stringify(TITLE)}${TICKET ? ` --ticket ${TICKET}` : ''}</pre>
  <dl class="files">
    <dt>__tests__/moduleGateManifest.test.ts</dt><dd>revokes each module in the plan, scores every id, writes the manifest</dd>
    <dt>__tests__/fixtures/entitlement.full.json</dt><dd>the full 15-module catalog, generated from the graph</dd>
    <dt>skills/module-gate-evidence/scripts/report.mjs</dt><dd>builds this page</dd>
    <dt>skills/module-gate-evidence/reference/manifest.md</dt><dd>the schema both stages agree on</dd>
  </dl>
</section>

<footer>
  manifest ${esc(m.source ?? 'code')} · generated ${esc(m.generatedAt ?? '')}${
    m.capturedAt ? ` · captured ${esc(m.capturedAt)}` : ''
  } ·
  ${n(runs.length)} runs · ${n(idsPerRun)} ids per run · ${n(goneTotal)} hidden-id findings ·
  ${n(passed)} assertions passed, ${n(failed)} failed, ${n(leaks)} leaks
</footer>
</main>
</div>
`;

fs.writeFileSync(outPath, html);
console.log(
  `${outPath}: ${runs.length} runs, ${n(decisions)} decisions, ${n(passed)} assertions, ${(
    html.length / 1024
  ).toFixed(0)}KB`,
);
