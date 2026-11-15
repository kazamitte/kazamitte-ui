'use client';

import {
  createContext,
  use,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { ark } from '@ark-ui/react/factory';
import { Check } from 'lucide-react';
import { tv } from '../../tv';
import { VisuallyHidden } from '../VisuallyHidden';

export type TimelineState = 'default' | 'active' | 'done';

// The dot and the line are borders, not fills, so forced-colors mode keeps
// them. Each state also differs in shape (hollow, haloed, checked), so the
// state never rests on color alone.
const timelineStyles = tv({
  slots: {
    root: 'm-0 flex list-none flex-col p-0',
    item: 'group/item grid grid-cols-[auto_1fr] gap-x-3',
    marker: 'row-span-2 flex flex-col items-center',
    dotWrap: 'relative mt-1 size-4 shrink-0',
    // Blurred, so it reads as light around the dot rather than a ring.
    halo: 'absolute -inset-1 rounded-pill bg-(--r-primary-bg-solid)/50 blur-sm',
    dot: 'relative flex size-full items-center justify-center rounded-pill border-2 [&>svg]:size-3',
    line: 'mt-1 -mb-1 w-0 grow border-s-2 base-border group-last/item:hidden',
    when: 'block text-oneline-14 font-medium base-fg-muted',
    content: 'pb-6 text-body-16 base-fg group-last/item:pb-0',
  },
  variants: {
    state: {
      default: { dot: 'base-border-solid base-bg' },
      active: {
        dot: 'primary-border-solid primary-bg-solid',
        // The halo is the lamp. Two 2s pulses stay under the 5s that WCAG
        // 2.2.2 allows without a pause control, then it stays lit; under
        // reduced motion it never pulses.
        halo: 'animate-pulse [animation-iteration-count:2] motion-reduce:animate-none',
        when: 'primary-fg',
      },
      done: {
        dot: 'primary-border-solid primary-bg-solid primary-fg-contrast',
      },
    },
  },
  defaultVariants: { state: 'default' },
});

const styles = timelineStyles();

const StateContext = createContext<TimelineState>('default');

// Spoken before the time, so a screen reader hears "完了 9:00 朝礼".
const STATE_LABELS: Record<TimelineState, string | undefined> = {
  default: undefined,
  active: '進行中',
  done: '完了',
};

export const TimelineRoot = ({
  className,
  ...props
}: ComponentPropsWithRef<'ol'>) => (
  <ol className={styles.root({ className })} {...props} />
);

type TimelineItemProps = ComponentPropsWithRef<'li'> & {
  state?: TimelineState;
};

export const TimelineItem = ({
  state = 'default',
  className,
  ...props
}: TimelineItemProps) => (
  <StateContext value={state}>
    <li className={styles.item({ className })} {...props} />
  </StateContext>
);

type TimelineMarkerProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  // Overrides the spoken state, e.g. "現在" for a history timeline.
  label?: ReactNode;
};

export const TimelineMarker = ({
  label,
  className,
  ...props
}: TimelineMarkerProps) => {
  const state = use(StateContext);
  const slots = timelineStyles({ state });
  const spoken = label ?? STATE_LABELS[state];
  return (
    <span className={slots.marker({ className })} {...props}>
      <span aria-hidden="true" className={slots.dotWrap()}>
        {state === 'active' && (
          <span data-part="halo" className={slots.halo()} />
        )}
        <span data-part="dot" className={slots.dot()}>
          {state === 'done' && <Check strokeWidth={3} />}
        </span>
      </span>
      <span data-part="line" aria-hidden="true" className={slots.line()} />
      {spoken !== undefined && <VisuallyHidden>{spoken}</VisuallyHidden>}
    </span>
  );
};

export const TimelineWhen = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof ark.span>) => {
  const state = use(StateContext);
  return (
    <ark.span
      className={timelineStyles({ state }).when({ className })}
      {...props}
    />
  );
};

export const TimelineContent = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof ark.div>) => (
  <ark.div className={styles.content({ className })} {...props} />
);
