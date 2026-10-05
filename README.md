# kazamitte-ui

An accessibility-first design system: design tokens for Tailwind CSS v4 and the React components built on them.

| Package                                      | Directory         | What it is                                            |
| -------------------------------------------- | ----------------- | ----------------------------------------------------- |
| [`@kazamitte/design-token`](packages/tokens) | `packages/tokens` | Color, typography and style themes as Tailwind v4 CSS |
| [`@kazamitte/kazamitte-ui`](packages/react)  | `packages/react`  | React components on Ark UI, styled with the tokens    |

Both live in one repository because they change together: renaming a token means updating the component classes and the tailwind-merge config in the same commit. `packages/react` depends on the tokens through `workspace:^`, which `pnpm publish` rewrites to the published version.

## Development

Node 24+ and pnpm 11.

```sh
pnpm install
pnpm verify          # format, lint, typecheck, unit tests, build
pnpm test:browser    # real Chromium: contrast, focus, keyboard
```

`packages/react` exports its `src` so the workspace (and a catalog app linking it) uses it without a build. `pnpm build` (tsdown) writes `dist`, one file per module so each component keeps its `'use client'`.

## Release

Bump the versions, then:

```sh
pnpm release   # pnpm -r publish: tokens first, then react
```

Publish with pnpm only: it swaps in `publishConfig.exports` (`dist`) and rewrites `workspace:` ranges, which npm and yarn don't. `packages/react`'s `prepublishOnly` checks this and refuses git dependencies, then builds.

## License

MIT
