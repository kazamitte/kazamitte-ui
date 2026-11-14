# Changelog

## Unreleased

### Breaking changes

- `@ark-ui/react` is a peer dependency. Install it next to the kit (`pnpm add @ark-ui/react`).

### Fixes

- README: pre-bundling the kit with Vitest needs `react-dom` excluded too; otherwise Tabs panels lose their labels. Covered by a new `prebundle` test project.
- The build checks that `react`, `react-dom` and `@ark-ui/react` stay peer dependencies and that nothing from `node_modules` is bundled into `dist`.

## 0.2.0

Requires `@kazamitte/design-token` 0.4.1 or later (the `border` step). Tested with `@ark-ui/react` 5.40; the Ark UI notes below describe its behavior.

### Breaking changes

- **Toast**: a toast stays until it is closed. Pass `duration` to let it disappear; durations under `MIN_TOAST_DURATION` (5000 ms) are raised to it (WCAG 2.2.1). Toasts with an undo action should not pass `duration`.
- **TagsInput**: the clear-all trigger is opt-in. Pass `clearable` to show it.
- **Button**: `loading` sets `aria-disabled` instead of `disabled`, so focus stays on the button; clicks and form submission are blocked while loading.
- **Borders**: input controls use `base-border-solid` (WCAG 1.4.11, 3:1). Containers and floating surfaces (Card, List, Table, CodeBlock, Menu, Popover, Toast, …) use the new `base-border` step. Visual change only.
- **Touch targets**: Button `sm`/`md`, close buttons and small triggers grow to 44px on coarse pointers.
- **Ark UI 5.40** behavior: Field links its error text through `aria-describedby` only (no `aria-errormessage`); Tour content is `role="dialog"`; Menu `onSelect` details also carry `modifiers`; RatingGroup names a half value with its real value (e.g. 2.5).

### New components

- `LiveRegion` and `useAnnounce` (screen reader announcements; `UIProvider` mounts the announcer)
- `SkipLink`
- `Toolbar` (Root, Button, Link, Group, Separator; one tab stop, arrow keys inside)
- `TabNav` (page navigation styled like Tabs, `aria-current="page"`)
- `List` (Root, Header with optional `sticky`, Items, Row, Empty, Skeleton)
- `Prose` (typography for rendered Markdown)

### New props and helpers

- Every component accepts `ref` (React 19). Composite components keep `ref` on the root and add `inputRef` (Combobox, DatePicker, DateInput, TagsInput, NumberInput, PasswordInput, ColorPicker, Editable), `triggerRef` (Select), `contentRef` (Listbox) and `treeRef` (TreeView) for the element that takes focus.
- `portalled` on Select, Combobox and DatePicker (render the popup in place, e.g. inside a Dialog or Drawer).
- `Button` `loading` and `loadingText`; `Alert.Actions`.
- `Skeleton` `delay` (default 200 ms) and `label`.
- `RadioGroup` options take `description`, `meta` and `icon`; `variant="card"`. `Checkbox` takes `description` and `variant="card"`.
- `toDateString`/`fromDateString` for `YYYY-MM-DD` strings.
- `Icon` accepts any `ComponentType<SVGProps<SVGSVGElement>>`.
- `styles.css` now also brings `appear-late`, `current-marker` and a pointer cursor on enabled buttons.
- The tailwind-merge config knows the `border` step.

### Fixes

- ColorPicker, DatePicker and DateInput read the Field context: the focused control gets `aria-invalid` and the helper/error description.
- `Alert.Actions` buttons keep 4.5:1 text and 3:1 boundaries on solid alerts.
- A disabled `Toolbar.Button` no longer opens the Menu it triggers.
