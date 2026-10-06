'use client';

import type { ReactNode } from 'react';
import { NumberInput as ArkNumberInput } from '@ark-ui/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { tv, type VariantProps } from '../../tv';
import { fieldSlots, focusRing } from '../../variants';
import { inputStyles } from '../Input';

const numberInputStyles = tv({
  slots: {
    root: fieldSlots.root,
    label: fieldSlots.label,
    control: 'relative',
    input: [
      'pe-10 tabular-nums',
      'ark-invalid:error-border-solid',
      'ark-disabled:pointer-events-none ark-disabled:opacity-50',
    ],
    triggerGroup:
      'absolute inset-y-0 end-0 flex w-8 flex-col border-s base-border-muted',
    trigger: [
      'inline-flex flex-1 items-center justify-center base-fg-muted [&>svg]:size-3.5',
      'hover:base-bg-subtle hover:base-fg-strong',
      'ark-disabled:pointer-events-none ark-disabled:opacity-50',
      focusRing({ className: 'focus-visible:-outline-offset-2' }),
    ],
  },
  variants: {
    size: {
      sm: { input: inputStyles({ size: 'sm' }) },
      md: { input: inputStyles({ size: 'md' }) },
      lg: { input: inputStyles({ size: 'lg' }) },
    },
  },
  defaultVariants: { size: 'md' },
});

const defaultTranslations: ArkNumberInput.RootProps['translations'] = {
  incrementLabel: '増やす',
  decrementLabel: '減らす',
};

type NumberInputProps = Omit<ArkNumberInput.RootProps, 'children'> &
  VariantProps<typeof numberInputStyles> & {
    label?: ReactNode;
    placeholder?: string;
  };

export const NumberInput = ({
  label,
  placeholder,
  size,
  translations,
  className,
  ...props
}: NumberInputProps) => {
  const styles = numberInputStyles({ size });
  return (
    <ArkNumberInput.Root
      className={styles.root({ className })}
      translations={{ ...defaultTranslations, ...translations }}
      {...props}
    >
      {label !== undefined && (
        <ArkNumberInput.Label className={styles.label()}>
          {label}
        </ArkNumberInput.Label>
      )}
      <ArkNumberInput.Control className={styles.control()}>
        <ArkNumberInput.Input
          placeholder={placeholder}
          className={styles.input()}
        />
        <div className={styles.triggerGroup()}>
          <ArkNumberInput.IncrementTrigger className={styles.trigger()}>
            <ChevronUp aria-hidden="true" />
          </ArkNumberInput.IncrementTrigger>
          <ArkNumberInput.DecrementTrigger className={styles.trigger()}>
            <ChevronDown aria-hidden="true" />
          </ArkNumberInput.DecrementTrigger>
        </div>
      </ArkNumberInput.Control>
    </ArkNumberInput.Root>
  );
};
