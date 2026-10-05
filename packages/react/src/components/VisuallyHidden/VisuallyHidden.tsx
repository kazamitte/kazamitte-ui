'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { ark } from '@ark-ui/react';
import { tv } from '../../tv';

const visuallyHiddenStyles = tv({ base: 'sr-only' });

export const VisuallyHidden = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ark.span>) => (
  <ark.span className={visuallyHiddenStyles({ className })} {...props} />
);
