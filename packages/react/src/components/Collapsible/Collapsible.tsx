'use client';

import type { ComponentProps } from 'react';
import { Collapsible as ArkCollapsible } from '@ark-ui/react';
import { tv } from '../../tv';
import { focusRing } from '../../variants';

const collapsibleStyles = tv({
  slots: {
    root: '',
    trigger: focusRing(),
    content: 'overflow-hidden',
    indicator: [
      'inline-flex transition-transform duration-transition ease-standard',
      'ark-open:rotate-180',
    ],
  },
});

const styles = collapsibleStyles();

export const CollapsibleRoot = ({
  className,
  ...props
}: ComponentProps<typeof ArkCollapsible.Root>) => (
  <ArkCollapsible.Root className={styles.root({ className })} {...props} />
);

export const CollapsibleTrigger = ({
  className,
  ...props
}: ComponentProps<typeof ArkCollapsible.Trigger>) => (
  <ArkCollapsible.Trigger
    className={styles.trigger({ className })}
    {...props}
  />
);

export const CollapsibleContent = ({
  className,
  ...props
}: ComponentProps<typeof ArkCollapsible.Content>) => (
  <ArkCollapsible.Content
    className={styles.content({ className })}
    {...props}
  />
);

export const CollapsibleIndicator = ({
  className,
  ...props
}: ComponentProps<typeof ArkCollapsible.Indicator>) => (
  <ArkCollapsible.Indicator
    className={styles.indicator({ className })}
    {...props}
  />
);

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
  Indicator: CollapsibleIndicator,
};
