# @kazamitte/kazamitte-ui

A collection of accessible React components built on [Ark UI](https://ark-ui.com/) and styled using Tailwind CSS v4 and [`@kazamitte/design-token`](https://github.com/kazamitte/design-token).

## Requirements

- React 19
- Tailwind CSS v4
- `@kazamitte/design-token` (peer dependency: import in your stylesheet and select a theme to use)

## Install

```sh
pnpm add @kazamitte/kazamitte-ui @kazamitte/design-token tailwindcss react react-dom
```

## CSS

Import the design token, theme, and stylesheet for this package. The `styles.css` file adds the `ark-*` variants used by the components and specifies the package itself as a `@source`; This allows Tailwind to generate the class even if the component is located within `node_modules`.

```css
@import '@kazamitte/design-token/index.css';
@import '@kazamitte/design-token/theme/color/default.css';
@import '@kazamitte/design-token/theme/style/neutral.css';
@import '@kazamitte/kazamitte-ui/styles.css';

/* Tailwind skips node_modules: list design-token explicitly. */
@source '../node_modules/@kazamitte/design-token';
```

You don't need to import `tailwindcss` again; `@kazamitte/design-token/index.css` already imports Tailwind. Adjust the `@source` path to match the actual location of your stylesheet.

## Usage

```tsx
import { Button } from '@kazamitte/kazamitte-ui';

export function Save() {
  return <Button>Save</Button>;
}
```

### Subpaths

| Import                                   | What it is                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| `@kazamitte/kazamitte-ui`                | Every component                                                         |
| `@kazamitte/kazamitte-ui/twmerge-config` | The tailwind-merge config for the design tokens, to build your own `tv` |
| `@kazamitte/kazamitte-ui/variants`       | Shared style variants (`focusRing`, `menuListStyles`, …)                |
| `@kazamitte/kazamitte-ui/styles.css`     | `ark-*` variants and the package `@source`                              |

### Work with Tailwind Variants

When using Tailwind Variants or Tailwind Merge in your app, please use a shared `tailwind-merge` configuration to ensure utility classes are merged correctly. (With the default `tailwind-merge` configuration, `text-body-16` is mistakenly recognized as a color, causing it to be removed when writing `text-body-16 text-white`.)

```ts
import { createTV } from 'tailwind-variants';
import { configs } from '@kazamitte/kazamitte-ui/twmerge-config';

export const tv = createTV({ twMerge: true, twMergeConfig: configs });
```

## Development

Developed in the [kazamitte-ui](https://github.com/kazamitte/kazamitte-ui) workspace with `@kazamitte/design-token`; see its README.

## License

MIT
