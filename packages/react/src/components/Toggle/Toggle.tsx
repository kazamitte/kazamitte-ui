'use client';

import type { ComponentProps } from 'react';
import { Toggle as ArkToggle } from '@ark-ui/react';
import { tv, type VariantProps } from '../../tv';
import { focusRing } from '../../variants';
import { useToolbarItem } from '../Toolbar/context';

export const toggleStyles = tv({
  extend: focusRing,
  base: [
    'inline-flex items-center justify-center gap-2 rounded-control font-medium base-fg transition-colors',
    'hover:base-bg-subtle',
    'ark-on:primary-bg-muted ark-on:primary-fg',
    'ark-disabled:pointer-events-none ark-disabled:opacity-50',
  ],
  variants: {
    variant: {
      outline: 'border base-border-solid',
      ghost: '',
    },
    size: {
      sm: 'h-8 px-2.5 text-oneline-14',
      md: 'h-10 px-3 text-oneline-14',
      lg: 'h-12 px-4 text-oneline-16',
    },
  },
  defaultVariants: { variant: 'outline', size: 'md' },
});

type ToggleProps = ComponentProps<typeof ArkToggle.Root> &
  VariantProps<typeof toggleStyles>;

export const Toggle = ({
  variant,
  size,
  className,
  disabled,
  ...props
}: ToggleProps) => {
  // Inside a Toolbar the toolbar owns the arrow keys and the tab stop.
  const toolbarItem = useToolbarItem({
    disabled,
    focusableWhenDisabled: false,
  });
  return (
    <ArkToggle.Root
      className={toggleStyles({ variant, size, className })}
      disabled={toolbarItem.isDisabled || undefined}
      {...toolbarItem.attrs}
      {...props}
    />
  );
};
