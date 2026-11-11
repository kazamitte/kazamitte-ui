'use client';

import {
  useEffect,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from 'react';
import { tv, type VariantProps } from '../../tv';
import { LiveRegion } from '../LiveRegion';

// The pulse lives on ::before because appear-late and animate-pulse both
// animate opacity and one element can only run one of them.
const skeletonStyles = tv({
  base: [
    'relative',
    'before:absolute before:inset-0 before:animate-pulse before:rounded-[inherit] before:base-bg-muted motion-reduce:before:animate-none',
  ],
  variants: {
    shape: {
      rect: 'rounded-control',
      circle: 'rounded-pill',
      text: 'h-4 w-full rounded-tight',
    },
    delayed: {
      true: 'appear-late',
    },
  },
  defaultVariants: { shape: 'rect' },
});

type SkeletonProps = ComponentPropsWithRef<'div'> &
  Pick<VariantProps<typeof skeletonStyles>, 'shape'> & {
    loading?: boolean;
    delay?: number;
    label?: string;
  };

const useElapsed = (delay: number): boolean => {
  const [elapsed, setElapsed] = useState(delay <= 0);
  useEffect(() => {
    if (delay <= 0) return undefined;
    const timer = window.setTimeout(() => setElapsed(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
  return elapsed;
};

export const Skeleton = ({
  shape,
  loading = true,
  delay = 200,
  label,
  className,
  style,
  children,
  ...props
}: SkeletonProps) => {
  // The status waits as long as the picture, so a load that finishes inside
  // the delay never announces anything.
  const elapsed = useElapsed(label === undefined ? 0 : delay);
  if (!loading) return children;
  const delayed = delay > 0;
  return (
    <>
      {label !== undefined && <LiveRegion>{elapsed ? label : ''}</LiveRegion>}
      <div
        aria-hidden="true"
        className={skeletonStyles({ shape, delayed, className })}
        style={
          delayed
            ? ({ '--appear-delay': `${delay}ms`, ...style } as CSSProperties)
            : style
        }
        {...props}
      />
    </>
  );
};
