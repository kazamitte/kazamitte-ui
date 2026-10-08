import { tv } from './tv';

export const focusRing = tv({
  base: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:primary-focus-ring',
});

export const focusRingWithin = tv({
  base: 'ark-focus-visible:outline-2 ark-focus-visible:outline-offset-2 ark-focus-visible:primary-focus-ring',
});

export const gapVariants = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
} as const;

export const menuListStyles = tv({
  slots: {
    // Zag copies the positioner's first child's z-index onto the positioner's
    // inline style, so z-index must live on `content`, not the positioner.
    positioner: '',
    content: [
      'z-popover max-h-72 min-w-40 overflow-y-auto rounded-overlay border base-border-muted base-bg p-1 shadow-floating',
      'ark-open:animate-fade-in ark-closed:animate-fade-out',
    ],
    item: [
      'flex cursor-default items-center gap-2 rounded-control px-2 py-1.5 text-dense-14 base-fg select-none',
      'ark-highlighted:base-bg-muted ark-highlighted:base-fg-strong',
      'ark-checked:font-medium ark-checked:base-fg-strong',
      'ark-disabled:pointer-events-none ark-disabled:opacity-50',
    ],
    itemText: 'flex-1 truncate',
    itemIndicator: 'inline-flex primary-fg [&>svg]:size-4',
    itemGroupLabel: 'px-2 py-1 text-oneline-14 font-bold base-fg-muted',
    separator: 'my-1 border-t base-border-muted',
    empty: 'px-2 py-1.5 text-dense-14 base-fg-muted',
  },
});

export type GroupedItemsBucket<T> = {
  key: string;
  label: string | undefined;
  items: T[];
};

// Ungrouped items stay out of ItemGroup: a group without a label is
// announced as an unnamed group.
export const splitGroupedItems = <T>(
  entries: [string, T[]][],
): GroupedItemsBucket<T>[] =>
  entries.map(([key, items]) => ({
    key,
    label: key === '' ? undefined : key,
    items,
  }));

export type ListItem = {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
};

export const listItemAccessors = {
  itemToString: (item: ListItem) => item.label,
  itemToValue: (item: ListItem) => item.value,
  isItemDisabled: (item: ListItem) => item.disabled === true,
  groupBy: (item: ListItem) => item.group ?? '',
};

export const fieldSlots = {
  root: 'flex flex-col gap-1.5',
  label: 'text-dense-14 font-medium base-fg-strong',
};

export const closeButtonStyles = tv({
  base: [
    'inline-flex items-center justify-center rounded-control base-fg-muted',
    'hover:base-bg-subtle hover:base-fg-strong',
    focusRing(),
  ],
});
