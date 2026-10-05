'use client';

import type { ReactNode } from 'react';
import { Switch as ArkSwitch } from '@ark-ui/react';
import { tv } from '../../tv';
import { focusRingWithin } from '../../variants';

const switchStyles = tv({
  slots: {
    root: [
      'inline-flex items-center gap-2',
      'ark-disabled:cursor-not-allowed ark-disabled:opacity-50',
    ],
    control: [
      'inline-flex h-6 w-10 shrink-0 items-center rounded-pill base-bg-muted p-0.5 transition-colors',
      'ark-checked:primary-bg-solid',
      focusRingWithin(),
    ],
    thumb: [
      'size-5 rounded-pill bg-(--r-base-fg-contrast) shadow-flat',
      'transition-transform duration-transition ease-standard',
      'ark-checked:translate-x-4',
    ],
    label: 'text-body-16 base-fg-strong',
  },
});

const styles = switchStyles();

type SwitchProps = ArkSwitch.RootProps & {
  label?: ReactNode;
};

export const Switch = ({ label, className, ...props }: SwitchProps) => (
  <ArkSwitch.Root className={styles.root({ className })} {...props}>
    <ArkSwitch.Control className={styles.control()}>
      <ArkSwitch.Thumb className={styles.thumb()} />
    </ArkSwitch.Control>
    {label !== undefined && (
      <ArkSwitch.Label className={styles.label()}>{label}</ArkSwitch.Label>
    )}
    <ArkSwitch.HiddenInput role="switch" />
  </ArkSwitch.Root>
);
