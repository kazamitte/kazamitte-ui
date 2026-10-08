# kazamitte-ui

Accessible React components on Ark UI and Tailwind CSS v4, styled with [`@kazamitte/design-token`](https://www.npmjs.com/package/@kazamitte/design-token).

| Package                                     | Directory        | What it is                                         |
| ------------------------------------------- | ---------------- | -------------------------------------------------- |
| [`@kazamitte/kazamitte-ui`](packages/react) | `packages/react` | React components on Ark UI, styled with the tokens |

The design tokens are published from their own repository and installed from npm.

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
pnpm release   # pnpm -r publish
```

Publish with pnpm only: it swaps in `publishConfig.exports` (`dist`), which npm and yarn don't. `packages/react`'s `prepublishOnly` checks this and refuses git dependencies, then builds.

## License

MIT
