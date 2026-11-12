'use client';

import type { ComponentPropsWithRef } from 'react';
import { ark } from '@ark-ui/react';
import { tv } from '../../tv';
import { Skeleton } from '../Skeleton';

// Root must not clip (no overflow-hidden): that would break a sticky Header
// inside a scrolling ancestor. The first and last pieces round their own
// corners instead.
const listStyles = tv({
  slots: {
    root: 'rounded-surface border base-border base-bg text-dense-14 base-fg',
    header:
      'rounded-t-surface border-b base-border base-bg-subtle px-4 py-3 text-body-16 font-semibold base-fg-strong',
    items: 'm-0 list-none p-0',
    row: 'border-b base-border-muted px-4 py-3 transition-colors last:rounded-b-surface last:border-b-0 hover:base-bg-muted',
    empty:
      'rounded-b-surface px-4 py-8 text-center text-dense-14 base-fg-muted',
    skeleton: 'flex flex-col',
    skeletonRow: 'flex flex-col gap-2 border-b base-border-muted px-4 py-3',
  },
  variants: {
    sticky: {
      true: { header: 'sticky top-0 z-docked' },
    },
  },
});

const styles = listStyles();

export const ListRoot = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof ark.div>) => (
  <ark.div className={styles.root({ className })} {...props} />
);

type ListHeaderProps = ComponentPropsWithRef<'div'> & {
  sticky?: boolean;
};

export const ListHeader = ({
  sticky,
  className,
  ...props
}: ListHeaderProps) => (
  <div className={listStyles({ sticky }).header({ className })} {...props} />
);

export const ListItems = ({
  className,
  ...props
}: ComponentPropsWithRef<'ul'>) => (
  <ul className={styles.items({ className })} {...props} />
);

export const ListRow = ({
  className,
  ...props
}: ComponentPropsWithRef<'li'>) => (
  <li className={styles.row({ className })} {...props} />
);

export const ListEmpty = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => (
  <div className={styles.empty({ className })} {...props} />
);

type ListSkeletonProps = ComponentPropsWithRef<'div'> & {
  rows?: number;
  label?: string;
};

// Placeholder rows are hidden from assistive tech by Skeleton itself; the
// one optional label is announced once for the whole list.
export const ListSkeleton = ({
  rows = 3,
  label,
  className,
  ...props
}: ListSkeletonProps) => (
  <div className={styles.skeleton({ className })} {...props}>
    {Array.from({ length: rows }, (_, index) => (
      <div
        key={`row-${index}`}
        data-part="skeleton-row"
        className={styles.skeletonRow({
          className: 'last:rounded-b-surface last:border-b-0',
        })}
      >
        <Skeleton shape="text" label={index === 0 ? label : undefined} />
        <Skeleton shape="text" className="w-2/3" />
      </div>
    ))}
  </div>
);
