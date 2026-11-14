'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';
import { Checkbox as ArkCheckbox } from '@ark-ui/react/checkbox';
import { Check, Minus } from 'lucide-react';
import { tv } from '../../tv';
import { choiceCardStyles, focusRingWithin } from '../../variants';

const checkboxStyles = tv({
  slots: {
    root: [
      'inline-flex items-center gap-2',
      'ark-disabled:cursor-not-allowed ark-disabled:opacity-50',
    ],
    control: [
      'grid size-5 shrink-0 place-items-center rounded-tight border base-border-solid',
      'primary-fg-contrast transition-colors',
      'ark-checked:primary-border-solid ark-checked:primary-bg-solid',
      'ark-indeterminate:primary-border-solid ark-indeterminate:primary-bg-solid',
      focusRingWithin(),
    ],
    indicator: 'flex size-3.5 items-center justify-center [&>svg]:size-full',
    body: 'flex min-w-0 flex-col gap-0.5',
    label: 'text-body-16 base-fg-strong',
    description: 'text-dense-14 base-fg',
  },
  variants: {
    variant: {
      default: {},
      card: {
        root: choiceCardStyles(),
        // The card draws the focus ring, so the control skips its own.
        control: 'mt-0.5 ark-focus-visible:outline-none',
        label: 'font-bold',
      },
    },
  },
  defaultVariants: { variant: 'default' },
});

type CheckboxProps = ComponentProps<typeof ArkCheckbox.Root> & {
  description?: ReactNode;
  variant?: 'default' | 'card';
} & (
    | { label: ReactNode }
    | { label?: undefined; 'aria-label': string }
    | { label?: undefined; 'aria-labelledby': string }
  );

export const Checkbox = ({
  label,
  description,
  variant,
  className,
  ...props
}: CheckboxProps) => {
  const styles = checkboxStyles({ variant });
  const id = useId();
  const descriptionId = `${id}-description`;
  const hasDescription = description !== undefined;

  return (
    <ArkCheckbox.Root className={styles.root({ className })} {...props}>
      <ArkCheckbox.Control className={styles.control()}>
        <ArkCheckbox.Indicator className={styles.indicator()}>
          <Check aria-hidden="true" />
        </ArkCheckbox.Indicator>
        <ArkCheckbox.Indicator indeterminate className={styles.indicator()}>
          <Minus aria-hidden="true" />
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      {(label !== undefined || hasDescription) && (
        <span className={styles.body()}>
          {label !== undefined && (
            <ArkCheckbox.Label className={styles.label()}>
              {label}
            </ArkCheckbox.Label>
          )}
          {hasDescription && (
            <span id={descriptionId} className={styles.description()}>
              {description}
            </span>
          )}
        </span>
      )}
      <ArkCheckbox.HiddenInput
        aria-describedby={hasDescription ? descriptionId : undefined}
      />
    </ArkCheckbox.Root>
  );
};
