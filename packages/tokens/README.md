# @kazamitte/design-token

A design token layer for Tailwind CSS v4 — color, typography, and style themes. Requires Tailwind v4.

Every color token clears WCAG AA for normal text. No single scale can do that across every hue, so the steps differ from color to color.

## Setup

```sh
pnpm add @kazamitte/design-token tailwindcss
```

### CSS

Import the Tailwind entry point.

```css
@import 'tailwindcss';

@import '@kazamitte/design-token/index.css';
@import '@kazamitte/design-token/theme/color/default.css';
@import '@kazamitte/design-token/theme/style/soft.css';

@source '../node_modules/@kazamitte/design-token';

body {
  background-color: var(--r-base-bg);
  color: var(--r-base-fg);
}
```

The `@source` directive is required because Tailwind v4 excludes `node_modules` from scanning by default.

### JavaScript

The JavaScript API exposes one function, for generating a color theme.

```ts
import { generateColorTheme } from '@kazamitte/design-token';
```

Everything the package does is delivered as CSS, so the JavaScript API is optional. Reach for it to generate several themes at once, or to swap themes at runtime from the app.

---

## Layout

```text
tailwind/
├─ base/
│  ├─ initialize.css       clears the Tailwind color / font / text namespaces
│  ├─ color/
│  │  ├─ palette.css       the raw palette (every --color-*)
│  │  ├─ semantic.css      --c-<hue>-*, 26 hues x 15 tokens, light/dark
│  │  ├─ status.css        error / warning / success / info
│  │  └─ utility.css       role utilities (primary-bg, base-fg, …)
│  ├─ typography/
│  │  ├─ font.css
│  │  └─ utility.css
│  └─ style/
│     ├─ animation.css     the keyframes and the --animate-* steps on them
│     ├─ radius.css        the radius scale
│     ├─ shadow.css        the shadow scale and the colors it is built from
│     └─ z-index.css       the layering scale
├─ theme/
│  ├─ color/               base / primary / secondary / link
│  └─ style/               neutral / editorial / soft / dense
└─ index.css               loads the base, the dark variant, duration utilities
```

## Color

### Roles

- Theme colors
  - primary
  - secondary
  - base
  - link
- Status colors
  - error — red
  - warning — amber
  - success — green
  - info — blue

Each role carries 15 tokens.

| Group      | Tokens                                                             |
| ---------- | ------------------------------------------------------------------ |
| Text       | `fg-strong`, `fg`, `fg-muted`, `fg-subtle`                         |
| Background | `bg`, `bg-subtle`, `bg-muted`, `bg-selected`, `bg-solid`           |
| Border     | `border-subtle`, `border-muted`, `border-selected`, `border-solid` |
| Contrast   | `fg-contrast`                                                      |
| Focus ring | `focus-ring`                                                       |

### Pairs that clear the contrast requirement

These four clear the WCAG AA threshold for normal text (4.5:1) across all 26 hues, in both light and dark.

- `fg-strong` on `bg-selected` — emphasized text on a hover surface
- `fg` on `bg-muted` — body text on a selected surface
- `fg-muted` on `bg` — secondary text on a tinted surface
- `fg-contrast` on `bg-solid` — the label on a filled control

`fg-subtle` is exempt from the requirement: it is meant for decoration and disabled states.

### Semantic tokens

All 26 hues expose the same 15 tokens under `--c-*`. Use them where a specific color is wanted directly — tags, categories, charts.

```html
<span class="bg-(--c-lime-bg-subtle) text-(--c-lime-fg)">Draft</span>
```

### Palette

Based on the Tailwind 4.3.0 default theme. All 26 hues are defined, including mauve, olive, mist and taupe, which Tailwind added in 4.2.

## Typography

Modeled on [digital-go-jp/tailwind-theme-plugin](https://github.com/digital-go-jp/tailwind-theme-plugin).

Each utility sets font-size, line-height and letter-spacing together.

```html
<h1 class="text-display-48">…</h1>
<p class="text-body-16">…</p>
```

| Utility            | Variants                  | Use              |
| ------------------ | ------------------------- | ---------------- |
| `text-display-*`   | 64, 56, 48, 44            | Hero, page title |
| `text-highlight-*` | 36, 32, 28, 26, 24, 22    | Headings         |
| `text-body-*`      | 20, 18, 16                | Body copy        |
| `text-dense-*`     | 18, 16, 14 (+ `-compact`) | Tables, dense UI |
| `text-oneline-*`   | 18, 16, 14                | Labels, buttons  |
| `text-mono-*`      | 18, 16, 14                | Code             |

## Style

A style preset sets spacing, radius, shadow, duration and easing together, so that the whole interface reads as one.

| Preset      | Character                                                              |
| ----------- | ---------------------------------------------------------------------- |
| `neutral`   | A balanced default                                                     |
| `editorial` | Sharp corners and the shallowest shadows; hierarchy comes from borders |
| `soft`      | Generous rounding and pronounced elevation                             |
| `dense`     | Minimal rounding and elevation, for information-dense UI               |

```html
<div class="rounded-surface shadow-raised hover:shadow-raised-hover"></div>
```

Radius and easing do not name their utilities after the `@theme` namespace they live in: `--radius-*` generates `rounded-*`, and `--ease-*` generates `ease-*`.

`--spacing` is the base step of the spacing scale and has no utility of its own. `p-4` is emitted as `calc(var(--spacing) * 4)`, so switching preset moves `p-*`, `m-*`, `gap-*`, `size-*` and the rest together — note that the sizing utilities read the same variable.

| Utility         | Variants                                       | Sets                         |
| --------------- | ---------------------------------------------- | ---------------------------- |
| `p-*` `gap-*` … | every utility reads `--spacing`, the base step | spacing and sizing           |
| `rounded-*`     | tight, control, surface, overlay, pill         | `border-radius`              |
| `shadow-*`      | flat, raised, floating (+ `-hover`), overlay   | `box-shadow`                 |
| `duration-*`    | instant, transition, enter                     | `transition-duration`        |
| `ease-*`        | standard, emphasized                           | `transition-timing-function` |
| `animate-*`     | fade / scale / slide, in and out               | `animation`                  |

Every duration collapses to 1ms under `prefers-reduced-motion: reduce`.

### Motion

`animate-*` covers the enter and exit of the things that appear over the page.

| Utility                     | Use                      |
| --------------------------- | ------------------------ |
| `animate-fade-in` / `-out`  | Scrims, tab panels       |
| `animate-scale-in` / `-out` | Dialogs, menus, popovers |
| `animate-slide-in-from-*`   | Drawers, sheets, toasts  |
| `animate-slide-out-to-*`    | The same, leaving        |

The slide steps take `top`, `right`, `bottom` and `left`, and travel the full
size of the element unless it says otherwise.

```html
<div class="animate-slide-in-from-bottom [--slide-distance:1rem]"></div>
```

Every step is composed from the preset's duration and easing, so it follows the
preset and collapses to 1ms under reduced motion. Tailwind's own `animate-spin`,
`-ping`, `-pulse` and `-bounce` are untouched and keep animating under reduced
motion.

Exit animations only play while the element is still in the tree; unmount it on
`animationend`.

Collapse and expand are not included. They need a measured height, which no
keyframe can supply.

### Layering

`z-*` follows [Chakra UI's z-index scale](https://chakra-ui.com/docs/theming/z-index), so the order matches what component libraries assume — notably `popover` above `modal`, since a select opened inside a dialog has to clear it.

| Step       | Value | Step       | Value      |
| ---------- | ----- | ---------- | ---------- |
| `hide`     | -1    | `overlay`  | 1300       |
| `base`     | 0     | `modal`    | 1400       |
| `docked`   | 10    | `popover`  | 1500       |
| `dropdown` | 1000  | `skip-nav` | 1600       |
| `sticky`   | 1100  | `toast`    | 1700       |
| `banner`   | 1200  | `tooltip`  | 1800       |
|            |       | `max`      | 2147483647 |

Layering does not vary by preset, so these are used directly rather than through
one. `z-10` and `z-auto` still work alongside them. `<dialog>` and the Popover
API render in the top layer, where z-index has no effect.

### Shadow

`--shadow-2xs` through `--shadow-2xl` are the base scale, seven steps. A preset picks one step per role and does nothing more; light and dark are resolved inside the scale, so no preset carries a dark override.

Each step reads its colors through the custom properties below. These four are all that `[data-mode='dark']` swaps.

| Custom property         | Light     | Dark      |
| ----------------------- | --------- | --------- |
| `--shadow-color-subtle` | black 5%  | black 35% |
| `--shadow-color`        | black 10% | black 50% |
| `--shadow-color-strong` | black 25% | black 70% |
| `--shadow-rim-color`    | black 7%  | white 12% |

A cast shadow barely reads on a dark surface, so every step opens with a `0 0 0 1px var(--shadow-rim-color)` rim. In dark it is that white rim that separates a surface from its background, while the heavier cast carries the elevation. `--shadow-2xs` is the rim alone — an edge with no elevation.

To recolor the shadows, redefine those four under `:root` and `[data-mode='dark']`; the whole scale, and every preset built on it, follows.

---

## AI assistance

The documentation and code in this package were written with AI agents — Claude and ChatGPT. Every output was reviewed by a human before it was committed.

## License

MIT. See [LICENSE](./LICENSE).

The color palette comes from Tailwind CSS and the typography scale from digital-go-jp/tailwind-theme-plugin, both MIT. Their notices are reproduced in [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).
