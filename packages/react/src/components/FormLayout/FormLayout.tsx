'use client';

import type { ComponentPropsWithRef } from 'react';
import { tv, type VariantProps } from '../../tv';

const formLayoutStyles = tv({
  slots: {
    root: 'flex flex-col gap-6',
    row: 'grid gap-4',
    actions:
      'flex flex-wrap items-center gap-3 border-t base-border-solid pt-6',
  },
  variants: {
    columns: {
      1: { row: 'grid-cols-1' },
      2: { row: 'grid-cols-1 sm:grid-cols-2' },
      3: { row: 'grid-cols-1 sm:grid-cols-3' },
    },
    align: {
      start: { actions: 'justify-start' },
      end: { actions: 'justify-end' },
      between: { actions: 'justify-between' },
    },
  },
  defaultVariants: { columns: 2, align: 'end' },
});

const styles = formLayoutStyles();

export const FormLayoutRoot = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => (
  <div className={styles.root({ className })} {...props} />
);

type FormLayoutRowProps = ComponentPropsWithRef<'div'> &
  Pick<VariantProps<typeof formLayoutStyles>, 'columns'>;

export const FormLayoutRow = ({
  columns,
  className,
  ...props
}: FormLayoutRowProps) => (
  <div className={styles.row({ columns, className })} {...props} />
);

type FormLayoutActionsProps = ComponentPropsWithRef<'div'> &
  Pick<VariantProps<typeof formLayoutStyles>, 'align'>;

export const FormLayoutActions = ({
  align,
  className,
  ...props
}: FormLayoutActionsProps) => (
  <div className={styles.actions({ align, className })} {...props} />
);
