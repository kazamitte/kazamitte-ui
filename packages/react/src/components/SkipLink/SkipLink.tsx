'use client';

import type { ComponentPropsWithRef } from 'react';
import { ark } from '@ark-ui/react/factory';
import { tv } from '../../tv';
import { focusRing } from '../../variants';

const skipLinkStyles = tv({
  extend: focusRing,
  base: [
    'sr-only rounded-control text-oneline-14 font-medium focus:px-4 focus:py-2',
    'primary-bg-solid primary-fg-contrast',
    'focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-skip-nav',
  ],
});

type SkipLinkProps = Omit<ComponentPropsWithRef<typeof ark.a>, 'href'> & {
  href: string;
};

export const SkipLink = ({
  className,
  children = '本文へ移動',
  ...props
}: SkipLinkProps) => (
  <ark.a className={skipLinkStyles({ className })} {...props}>
    {children}
  </ark.a>
);
