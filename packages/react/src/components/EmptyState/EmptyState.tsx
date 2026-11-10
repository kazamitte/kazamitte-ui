'use client';

import type { ComponentPropsWithRef } from 'react';
import { tv } from '../../tv';

const emptyStateStyles = tv({
  slots: {
    root: 'flex flex-col items-center gap-4 rounded-surface border border-dashed base-border-muted px-6 py-12 text-center',
    indicator:
      'inline-flex size-12 items-center justify-center rounded-pill base-bg-muted base-fg-muted [&>svg]:size-6',
    content: 'flex max-w-sm flex-col gap-1',
    title: 'text-body-18 font-semibold base-fg-strong',
    description: 'text-dense-14 base-fg-muted',
    actions: 'flex flex-wrap justify-center gap-3',
  },
});

const styles = emptyStateStyles();

export const EmptyStateRoot = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => (
  <div className={styles.root({ className })} {...props} />
);

export const EmptyStateIndicator = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => (
  <div
    aria-hidden="true"
    className={styles.indicator({ className })}
    {...props}
  />
);

export const EmptyStateContent = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => (
  <div className={styles.content({ className })} {...props} />
);

export const EmptyStateTitle = ({
  className,
  ...props
}: ComponentPropsWithRef<'p'>) => (
  <p className={styles.title({ className })} {...props} />
);

export const EmptyStateDescription = ({
  className,
  ...props
}: ComponentPropsWithRef<'p'>) => (
  <p className={styles.description({ className })} {...props} />
);

export const EmptyStateActions = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => (
  <div className={styles.actions({ className })} {...props} />
);
