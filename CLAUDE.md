# Amity Social Cloud UIKit — Web

`@amityco/ui-kit` — a React component library that gives an app a social feed, communities,
events, livestreams, stories and chat. Consumers install it and render `Amity*` components; it
ships as a bundle (`dist/`), not an application.

- **Package manager: pnpm** (`pnpm@9.5.0`). Never `npm` or `yarn`.
- Peer deps: `@amityco/ts-sdk`, `react >=17.0.2`, `react-dom >=17.0.2`.
- The SDK does the data; this repo does the UI. Read the SDK source before blaming the UIKit.

## Commands

```bash
pnpm build          # tsup bundle — CJS + ESM + d.ts
pnpm tsc            # type-check (the tree has pre-existing errors; compare counts, don't assume)
pnpm lint           # eslint + stylelint
pnpm test           # jest
pnpm storybook      # :6006 — the only way to run anything; there is no dev app
pnpm verify:gates   # every governance gate
```

## Layout

Everything current lives in `src/v4/`, split into three modules — `core`, `social`, `chat`:

```
src/v4/<module>/
  pages/XPage/            thin wrapper: useAmityPage + the feature root
  features/<feature>/     the implementation — layout, state, business logic
  components/X/           a customizable surface (useAmityComponent + componentId)
  elements/X/             a shared visual element
  hooks/objects|collections|queries/   the only place the SDK is called
  constants/ providers/ utils/
src/v4/core/design/       the design system — atoms, molecules, components, icons, illustrations
src/index.ts              the public surface: `X as AmityX`
```

Roughly 1,550 `.tsx`, 683 CSS modules, 1,200 localization keys, 120 public `Amity*` exports
(60 pages, 42 components).

**`Amity` is a public-API prefix only.** Internals are plain names; the prefix is applied in
`src/index.ts` as a re-export alias.

## Rules that always apply

- **Imports use the `~/` alias** (maps to `src/`). No relative imports, no explicit `/index`.
- **Every folder has a barrel `index.ts`**; consumers import the folder, not the file.
- **No code comments** unless asked — the code should read without them.
- **Localization keys are a cross-platform contract.** Never add one without approval; check iOS
  and Android for the canonical name first.
- **Never hardcode a `pageId` or `componentId`** — they are cross-platform contracts shared with
  iOS, Android and Flutter. Take the value from the spec and the registry, don't derive it from
  the Web name.
- **A customizable surface honours `isExcluded`** and applies `themeStyles` — otherwise its
  config silently does nothing.

## Skills

Invoke the skill rather than reconstructing the convention:

| Doing this                                           | Skill                        |
| ---------------------------------------------------- | ---------------------------- |
| New page                                             | `create-page`                |
| New component, or deciding if it is public           | `create-component`           |
| New icon                                             | `create-icon`                |
| Any SDK read or write                                | `sdk-integration`            |
| Any visible text                                     | `typography`, `localization` |
| Any CSS                                              | `styling`                    |
| Branch, commit, PR                                   | `git-convention`             |
| A QA-filed Jira ticket                               | `issue-resolver`             |
| Patterns — forms, pagination, menus, a11y, debugging | `feature-implementation`     |

## Governance gates

`governance/gates/` holds one gate per convention. Each is auto-discovered by `run.mjs`, takes
file paths, supports `--json`, and grades findings **SAFE** (mechanical) / **BREAKING**
(consumer-facing API) / **ADVISORY** (needs a judgement call).

| Gate                     | Enforces                                              |
| ------------------------ | ----------------------------------------------------- |
| `01-check-pages`         | page naming chain + page scaffolding                  |
| `02-check-tokens`        | theme token layers stay in sync                       |
| `03-check-config-owners` | config ownership                                      |
| `04-check-components`    | component chain, `componentId`, public export vs spec |
| `05-check-typography`    | `Typography` owns the type scale                      |
| `06-check-sdk-hooks`     | SDK hook folders, naming, mutations                   |
| `07-check-localization`  | key exists, locale parity, placeholder arity          |
| `08-check-styling`       | `rem` lengths, token colours, data-attribute variants |
| `09-check-icons`         | compound icon exports, `currentColor`, barrel         |

They run on staged files via lint-staged, so a commit is judged only on what it touches. **The
whole-tree runs are not green** — most findings pre-date the gates. Don't treat a red whole-tree
run as something you broke; check whether your files are implicated.

## Working agreements

- **Plan before implementing.** Present the approach and wait, rather than writing feature code
  first.
- **Show the diff.** Lead a change report with the file paths and an actual `git diff`.
- **Never commit or push unasked.** Show the work and wait for the go-ahead.
- **Verify before reporting.** Re-read ticket, PR and branch state live rather than repeating
  what was set earlier in the session.
