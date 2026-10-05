'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { ark } from '@ark-ui/react';
import { tv, type VariantProps } from '../../tv';
import { focusRing } from '../../variants';
import { VisuallyHidden } from '../VisuallyHidden';

export const linkStyles = tv({
  extend: focusRing,
  base: 'rounded-tight link-fg underline-offset-2 transition-colors hover:link-fg-strong',
  variants: {
    variant: {
      underline: 'underline',
      plain: 'no-underline hover:underline',
    },
  },
  defaultVariants: { variant: 'underline' },
});

type LinkProps = ComponentPropsWithoutRef<typeof ark.a> &
  VariantProps<typeof linkStyles> &
  (
    | {
        external?: boolean;
        asChild?: false;
      }
    | { external?: false; asChild: true }
  );

export const Link = ({
  variant,
  external = false,
  asChild,
  className,
  children,
  ...props
}: LinkProps) => (
  <ark.a
    asChild={asChild}
    className={linkStyles({ variant, className })}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    {...props}
  >
    {asChild === true ? (
      children
    ) : (
      <>
        {children}
        {external && <VisuallyHidden>（新しいタブで開きます）</VisuallyHidden>}
      </>
    )}
  </ark.a>
);
