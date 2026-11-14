'use client';

import type { ComponentProps, ReactNode } from 'react';
import { ToggleGroup as ArkToggleGroup } from '@ark-ui/react/toggle-group';
import { tv, type VariantProps } from '../../tv';
import { focusRing } from '../../variants';
import { useToolbarItem } from '../Toolbar/context';

const toggleGroupStyles = tv({
  slots: {
    root: 'inline-flex',
    item: [
      'inline-flex h-10 items-center justify-center gap-2 px-3 text-oneline-14 font-medium base-fg transition-colors',
      'hover:base-bg-subtle',
      'ark-on:primary-bg-muted ark-on:primary-fg',
      'ark-disabled:pointer-events-none ark-disabled:opacity-50',
      focusRing(),
    ],
  },
  variants: {
    variant: {
      attached: {
        root: 'rounded-control border base-border-solid',
        item: [
          'base-border-solid not-first:border-s',
          'first:rounded-s-control last:rounded-e-control',
        ],
      },
      separate: {
        root: 'gap-1',
        item: 'rounded-control border base-border-solid',
      },
    },
  },
  defaultVariants: { variant: 'attached' },
});

export type ToggleGroupItem = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type ToggleGroupProps = ComponentProps<typeof ArkToggleGroup.Root> &
  VariantProps<typeof toggleGroupStyles> & {
    items: ToggleGroupItem[];
  };

export const ToggleGroup = ({
  items,
  variant,
  deselectable = false,
  className,
  disabled,
  rovingFocus,
  ...props
}: ToggleGroupProps) => {
  // Inside a Toolbar the toolbar owns the arrow keys and the tab stop, so
  // Ark's own roving focus is turned off and each item joins the toolbar.
  const toolbarItem = useToolbarItem({
    disabled,
    focusableWhenDisabled: false,
  });
  const styles = toggleGroupStyles({ variant });
  return (
    // Single mode is a radiogroup, and a checked radio doesn't uncheck on
    // click; Ark defaults deselectable to true.
    <ArkToggleGroup.Root
      deselectable={deselectable}
      disabled={toolbarItem.isDisabled || undefined}
      rovingFocus={toolbarItem.inToolbar ? false : rovingFocus}
      className={styles.root({ className })}
      {...props}
    >
      {items.map((item) => (
        <ArkToggleGroup.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={styles.item()}
          {...toolbarItem.attrs}
        >
          {item.label}
        </ArkToggleGroup.Item>
      ))}
    </ArkToggleGroup.Root>
  );
};
