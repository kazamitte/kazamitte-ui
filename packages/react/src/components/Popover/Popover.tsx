'use client';

import { Popover as ArkPopover, Portal } from '@ark-ui/react';
import { X } from 'lucide-react';
import { tv } from '../../tv';
import { focusRing } from '../../variants';

const popoverStyles = tv({
  slots: {
    positioner: '',
    content: [
      'relative z-popover w-72 rounded-overlay border base-border-muted base-bg p-4 text-body-16 base-fg shadow-overlay',
      'ark-open:animate-scale-in ark-closed:animate-scale-out',
      focusRing(),
    ],
    arrow: '[--arrow-background:var(--r-base-bg)] [--arrow-size:10px]',
    title: 'pe-8 text-body-16 font-bold base-fg-strong',
    description: 'mt-1 text-dense-14 base-fg-muted',
    closeTrigger: [
      'absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-control base-fg-muted',
      'hover:base-bg-subtle hover:base-fg-strong',
      focusRing(),
    ],
  },
});

const styles = popoverStyles();

const defaultPositioning: ArkPopover.RootProps['positioning'] = {
  placement: 'bottom',
  gutter: 8,
};

export const PopoverRoot = ({
  positioning,
  ...props
}: ArkPopover.RootProps) => (
  <ArkPopover.Root
    positioning={{ ...defaultPositioning, ...positioning }}
    {...props}
  />
);

export const PopoverTrigger = ArkPopover.Trigger;

export const PopoverAnchor = ArkPopover.Anchor;

export const PopoverPortal = Portal;

export const PopoverPositioner = ({
  className,
  ...props
}: ArkPopover.PositionerProps) => (
  <ArkPopover.Positioner
    className={styles.positioner({ className })}
    {...props}
  />
);

export const PopoverContent = ({
  className,
  ...props
}: ArkPopover.ContentProps) => (
  <ArkPopover.Content className={styles.content({ className })} {...props} />
);

export const PopoverArrow = ({
  className,
  ...props
}: ArkPopover.ArrowProps) => (
  <ArkPopover.Arrow className={styles.arrow({ className })} {...props}>
    <ArkPopover.ArrowTip />
  </ArkPopover.Arrow>
);

export const PopoverTitle = ({
  className,
  ...props
}: ArkPopover.TitleProps) => (
  <ArkPopover.Title className={styles.title({ className })} {...props} />
);

export const PopoverDescription = ({
  className,
  ...props
}: ArkPopover.DescriptionProps) => (
  <ArkPopover.Description
    className={styles.description({ className })}
    {...props}
  />
);

export const PopoverCloseTrigger = ({
  className,
  children,
  ...props
}: ArkPopover.CloseTriggerProps) => (
  <ArkPopover.CloseTrigger
    aria-label="閉じる"
    className={styles.closeTrigger({ className })}
    {...props}
  >
    {children ?? <X aria-hidden="true" className="size-4" />}
  </ArkPopover.CloseTrigger>
);
