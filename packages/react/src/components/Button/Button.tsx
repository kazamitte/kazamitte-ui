'use client';

import type { ComponentPropsWithRef } from 'react';
import { ark } from '@ark-ui/react/factory';
import { tv, type VariantProps } from '../../tv';
import { focusRing } from '../../variants';
import { Spinner } from '../Spinner';

export const buttonStyles = tv({
  extend: focusRing,
  base: [
    'inline-flex items-center justify-center gap-2',
    'rounded-control font-medium transition-colors',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary: ['primary-bg-solid primary-fg-contrast', 'hover:opacity-90'],
      outline: [
        'border base-border-solid base-fg-strong',
        'hover:base-bg-subtle',
      ],
      ghost: ['base-fg-strong', 'hover:base-bg-subtle'],
      link: ['link-fg underline underline-offset-2', 'hover:link-fg-strong'],
    },
    // aria-disabled, not disabled, so the button keeps focus while it works.
    loading: {
      true: 'relative cursor-progress',
    },
    size: {
      sm: 'h-8 px-3 text-oneline-14 pointer-coarse:min-h-11',
      md: 'h-10 px-4 text-oneline-16 pointer-coarse:min-h-11',
      lg: 'h-12 px-6 text-oneline-16',
    },
  },
  compoundVariants: [
    { variant: 'link', class: 'h-auto px-0 pointer-coarse:min-h-0' },
  ],
  defaultVariants: { variant: 'primary', size: 'md' },
});

type ButtonProps = ComponentPropsWithRef<typeof ark.button> &
  Pick<VariantProps<typeof buttonStyles>, 'variant' | 'size'> & {
    loading?: boolean;
    loadingText?: string;
  };

export const Button = ({
  variant,
  size,
  type,
  asChild,
  loading = false,
  loadingText,
  className,
  children,
  onClick,
  'aria-disabled': ariaDisabled,
  ...props
}: ButtonProps) => {
  const isLoading = loading && asChild !== true;
  return (
    <ark.button
      asChild={asChild}
      type={asChild === true ? type : (type ?? 'button')}
      aria-disabled={loading ? true : ariaDisabled}
      onClick={(event) => {
        // Also stops a submit button from submitting the form.
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={buttonStyles({
        variant,
        size,
        loading: isLoading,
        className,
      })}
      {...props}
    >
      {isLoading ? (
        loadingText === undefined ? (
          <>
            {/* Dimmed, not hidden, so the label keeps the width and the name. */}
            <span className="opacity-0">{children}</span>
            <Spinner
              decorative
              size="sm"
              className="absolute border-t-current"
            />
          </>
        ) : (
          <>
            <Spinner decorative size="sm" className="border-t-current" />
            {loadingText}
          </>
        )
      ) : (
        children
      )}
    </ark.button>
  );
};
