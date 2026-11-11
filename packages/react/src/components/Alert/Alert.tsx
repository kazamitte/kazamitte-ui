'use client';

import { createContext, useContext, type ComponentPropsWithRef } from 'react';
import {
  CircleAlert,
  CircleCheck,
  Info,
  OctagonAlert,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import { tv, type VariantProps } from '../../tv';

const alertStyles = tv({
  slots: {
    root: 'flex gap-3 rounded-surface border p-4 text-body-16',
    indicator: 'mt-0.5 inline-flex shrink-0 [&>svg]:size-5',
    content: 'flex min-w-0 flex-1 flex-col gap-1',
    title: 'font-bold',
    description: '',
    actions: 'mt-2 flex flex-wrap gap-2',
  },
  variants: {
    status: {
      neutral: { root: 'base-border-muted base-bg-subtle base-fg' },
      info: { root: 'info-border-muted info-bg info-fg' },
      success: { root: 'success-border-muted success-bg success-fg' },
      warning: { root: 'warning-border-muted warning-bg warning-fg' },
      error: { root: 'error-border-muted error-bg error-fg' },
    },
    variant: {
      subtle: {},
      solid: {},
    },
  },
  compoundVariants: [
    {
      status: 'neutral',
      variant: 'solid',
      class: { root: 'base-border-solid base-bg-solid base-fg-contrast' },
    },
    {
      status: 'info',
      variant: 'solid',
      class: { root: 'info-border-solid info-bg-solid info-fg-contrast' },
    },
    {
      status: 'success',
      variant: 'solid',
      class: {
        root: 'success-border-solid success-bg-solid success-fg-contrast',
      },
    },
    {
      status: 'warning',
      variant: 'solid',
      class: {
        root: 'warning-border-solid warning-bg-solid warning-fg-contrast',
      },
    },
    {
      status: 'error',
      variant: 'solid',
      class: { root: 'error-border-solid error-bg-solid error-fg-contrast' },
    },
  ],
  defaultVariants: { status: 'neutral', variant: 'subtle' },
});

// Buttons keep their own variants, so on a solid alert the colors are
// swapped one level up: the roles a button reads are pointed at the
// alert's contrast color and background. Every pairing then repeats the
// alert's own text-on-fill contrast. The hover tint of outline and ghost
// is a mix of the two, so the label never lands on a light base tint.
// Written out in full because Tailwind only finds class names it can read.
const solidActions: Record<
  NonNullable<VariantProps<typeof alertStyles>['status']>,
  string[]
> = {
  neutral: [
    '[--r-primary-bg-solid:var(--r-base-fg-contrast)]',
    '[--r-primary-fg-contrast:var(--r-base-bg-solid)]',
    '[--r-primary-focus-ring:var(--r-base-fg-contrast)]',
    '[--r-base-fg-strong:var(--r-base-fg-contrast)]',
    '[--r-base-border-solid:var(--r-base-fg-contrast)]',
    '[--r-base-bg-subtle:color-mix(in_oklab,var(--r-base-fg-contrast)_15%,var(--r-base-bg-solid))]',
    '[--r-link-fg:var(--r-base-fg-contrast)]',
    '[--r-link-fg-strong:var(--r-base-fg-contrast)]',
  ],
  info: [
    '[--r-primary-bg-solid:var(--r-info-fg-contrast)]',
    '[--r-primary-fg-contrast:var(--r-info-bg-solid)]',
    '[--r-primary-focus-ring:var(--r-info-fg-contrast)]',
    '[--r-base-fg-strong:var(--r-info-fg-contrast)]',
    '[--r-base-border-solid:var(--r-info-fg-contrast)]',
    '[--r-base-bg-subtle:color-mix(in_oklab,var(--r-info-fg-contrast)_15%,var(--r-info-bg-solid))]',
    '[--r-link-fg:var(--r-info-fg-contrast)]',
    '[--r-link-fg-strong:var(--r-info-fg-contrast)]',
  ],
  success: [
    '[--r-primary-bg-solid:var(--r-success-fg-contrast)]',
    '[--r-primary-fg-contrast:var(--r-success-bg-solid)]',
    '[--r-primary-focus-ring:var(--r-success-fg-contrast)]',
    '[--r-base-fg-strong:var(--r-success-fg-contrast)]',
    '[--r-base-border-solid:var(--r-success-fg-contrast)]',
    '[--r-base-bg-subtle:color-mix(in_oklab,var(--r-success-fg-contrast)_15%,var(--r-success-bg-solid))]',
    '[--r-link-fg:var(--r-success-fg-contrast)]',
    '[--r-link-fg-strong:var(--r-success-fg-contrast)]',
  ],
  warning: [
    '[--r-primary-bg-solid:var(--r-warning-fg-contrast)]',
    '[--r-primary-fg-contrast:var(--r-warning-bg-solid)]',
    '[--r-primary-focus-ring:var(--r-warning-fg-contrast)]',
    '[--r-base-fg-strong:var(--r-warning-fg-contrast)]',
    '[--r-base-border-solid:var(--r-warning-fg-contrast)]',
    '[--r-base-bg-subtle:color-mix(in_oklab,var(--r-warning-fg-contrast)_15%,var(--r-warning-bg-solid))]',
    '[--r-link-fg:var(--r-warning-fg-contrast)]',
    '[--r-link-fg-strong:var(--r-warning-fg-contrast)]',
  ],
  error: [
    '[--r-primary-bg-solid:var(--r-error-fg-contrast)]',
    '[--r-primary-fg-contrast:var(--r-error-bg-solid)]',
    '[--r-primary-focus-ring:var(--r-error-fg-contrast)]',
    '[--r-base-fg-strong:var(--r-error-fg-contrast)]',
    '[--r-base-border-solid:var(--r-error-fg-contrast)]',
    '[--r-base-bg-subtle:color-mix(in_oklab,var(--r-error-fg-contrast)_15%,var(--r-error-bg-solid))]',
    '[--r-link-fg:var(--r-error-fg-contrast)]',
    '[--r-link-fg-strong:var(--r-error-fg-contrast)]',
  ],
};

type AlertVariants = VariantProps<typeof alertStyles>;
type AlertStatus = NonNullable<AlertVariants['status']>;

const statusIcons: Record<AlertStatus, LucideIcon> = {
  neutral: Info,
  info: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
  error: OctagonAlert,
};

const styles = alertStyles();

type SolidContext = { status: AlertStatus; variant: 'subtle' | 'solid' };
const AlertContext = createContext<SolidContext>({
  status: 'neutral',
  variant: 'subtle',
});

type AlertRootProps = ComponentPropsWithRef<'div'> &
  AlertVariants & {
    live?: 'polite' | 'assertive';
  };

export const AlertRoot = ({
  status,
  variant,
  live,
  className,
  ...props
}: AlertRootProps) => (
  <AlertContext.Provider
    value={{ status: status ?? 'neutral', variant: variant ?? 'subtle' }}
  >
    <div
      role={live === 'assertive' ? 'alert' : undefined}
      aria-live={live === 'polite' ? 'polite' : undefined}
      aria-atomic={live === 'polite' ? true : undefined}
      className={alertStyles({ status, variant }).root({ className })}
      {...props}
    />
  </AlertContext.Provider>
);

type AlertIndicatorProps = ComponentPropsWithRef<'span'> & {
  status?: AlertStatus;
};

export const AlertIndicator = ({
  status = 'neutral',
  className,
  children,
  ...props
}: AlertIndicatorProps) => {
  const DefaultIcon = statusIcons[status];
  return (
    <span
      aria-hidden="true"
      className={styles.indicator({ className })}
      {...props}
    >
      {children ?? <DefaultIcon aria-hidden="true" />}
    </span>
  );
};

export const AlertContent = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => (
  <div className={styles.content({ className })} {...props} />
);

export const AlertTitle = ({
  className,
  ...props
}: ComponentPropsWithRef<'p'>) => (
  <p className={styles.title({ className })} {...props} />
);

export const AlertDescription = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => (
  <div className={styles.description({ className })} {...props} />
);

export const AlertActions = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => {
  const { status, variant } = useContext(AlertContext);
  return (
    <div
      className={styles.actions({
        className: [variant === 'solid' && solidActions[status], className],
      })}
      {...props}
    />
  );
};
