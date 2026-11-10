'use client';

import type { ComponentPropsWithRef } from 'react';
import { tv } from '../../tv';

const kbdStyles = tv({
  base: [
    'inline-flex items-center rounded-tight border base-border-muted base-bg-muted px-1.5',
    'font-mono text-mono-14 base-fg-strong',
  ],
});

export const Kbd = ({ className, ...props }: ComponentPropsWithRef<'kbd'>) => (
  <kbd className={kbdStyles({ className })} {...props} />
);
