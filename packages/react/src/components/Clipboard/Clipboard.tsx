'use client';

import type { ComponentProps } from 'react';
import { Clipboard as ArkClipboard } from '@ark-ui/react';
import { tv } from '../../tv';
import { fieldSlots, focusRing } from '../../variants';

const clipboardStyles = tv({
  slots: {
    root: fieldSlots.root,
    label: fieldSlots.label,
    control: 'flex items-center gap-2',
    input: [
      'min-w-0 flex-1 rounded-control border base-border base-bg px-3 py-2',
      'font-mono text-mono-14 base-fg',
      focusRing(),
    ],
    trigger: [
      'inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-control border base-border-solid px-3',
      'text-oneline-14 font-medium base-fg-strong transition-colors',
      'hover:base-bg-subtle',
      'ark-copied:success-border-solid ark-copied:success-fg',
      focusRing(),
    ],
    indicator: 'inline-flex items-center',
    valueText: 'font-mono text-mono-14 base-fg',
  },
});

const styles = clipboardStyles();

const defaultTranslations: ComponentProps<
  typeof ArkClipboard.Root
>['translations'] = {
  triggerLabel: (copied) => (copied ? 'コピーしました' : 'コピー'),
};

export const ClipboardRoot = ({
  className,
  translations,
  ...props
}: ComponentProps<typeof ArkClipboard.Root>) => (
  <ArkClipboard.Root
    className={styles.root({ className })}
    translations={{ ...defaultTranslations, ...translations }}
    {...props}
  />
);

export const ClipboardLabel = ({
  className,
  ...props
}: ComponentProps<typeof ArkClipboard.Label>) => (
  <ArkClipboard.Label className={styles.label({ className })} {...props} />
);

export const ClipboardControl = ({
  className,
  ...props
}: ComponentProps<typeof ArkClipboard.Control>) => (
  <ArkClipboard.Control className={styles.control({ className })} {...props} />
);

export const ClipboardInput = ({
  className,
  ...props
}: ComponentProps<typeof ArkClipboard.Input>) => (
  <ArkClipboard.Input className={styles.input({ className })} {...props} />
);

export const ClipboardTrigger = ({
  className,
  ...props
}: ComponentProps<typeof ArkClipboard.Trigger>) => (
  <ArkClipboard.Trigger className={styles.trigger({ className })} {...props} />
);

export const ClipboardIndicator = ({
  className,
  ...props
}: ComponentProps<typeof ArkClipboard.Indicator>) => (
  <ArkClipboard.Indicator
    className={styles.indicator({ className })}
    {...props}
  />
);

export const ClipboardValueText = ({
  className,
  ...props
}: ComponentProps<typeof ArkClipboard.ValueText>) => (
  <ArkClipboard.ValueText
    className={styles.valueText({ className })}
    {...props}
  />
);

export const Clipboard = {
  Root: ClipboardRoot,
  Label: ClipboardLabel,
  Control: ClipboardControl,
  Input: ClipboardInput,
  Trigger: ClipboardTrigger,
  Indicator: ClipboardIndicator,
  ValueText: ClipboardValueText,
};
