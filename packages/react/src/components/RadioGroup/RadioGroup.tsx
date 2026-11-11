'use client';

import {
  useId,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from 'react';
import { RadioGroup as ArkRadioGroup } from '@ark-ui/react';
import { tv } from '../../tv';
import { choiceCardStyles, fieldSlots, focusRingWithin } from '../../variants';
import { Icon } from '../Icon';

const radioGroupStyles = tv({
  slots: {
    root: 'flex flex-col gap-2',
    label: fieldSlots.label,
    item: [
      'inline-flex items-center gap-2',
      'ark-disabled:cursor-not-allowed ark-disabled:opacity-50',
    ],
    itemControl: [
      'size-5 shrink-0 rounded-pill border base-border-solid base-bg transition-colors',
      'ark-checked:border-5 ark-checked:primary-border-solid',
      focusRingWithin(),
    ],
    itemText: 'text-body-16 base-fg-strong',
    body: 'flex min-w-0 flex-1 flex-col gap-0.5',
    description: 'text-dense-14 base-fg',
    meta: 'shrink-0 text-dense-14 base-fg',
    icon: 'base-fg-strong',
  },
  variants: {
    variant: {
      default: {},
      card: {
        root: 'grid gap-3 sm:grid-cols-2',
        label: 'sm:col-span-2',
        item: choiceCardStyles(),
        // The card draws the focus ring, so the control skips its own.
        itemControl: 'mt-0.5 ark-focus-visible:outline-none',
        itemText: 'font-bold',
      },
    },
  },
  defaultVariants: { variant: 'default' },
});

type RadioOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  description?: ReactNode;
  meta?: ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

type RadioGroupProps = ComponentProps<typeof ArkRadioGroup.Root> & {
  options: RadioOption[];
  label?: ReactNode;
  variant?: 'default' | 'card';
};

type RadioItemProps = {
  option: RadioOption;
  styles: ReturnType<typeof radioGroupStyles>;
};

const RadioItem = ({ option, styles }: RadioItemProps) => {
  const id = useId();
  const descriptionId = `${id}-description`;
  const metaId = `${id}-meta`;
  const hasDescription = option.description !== undefined;
  const hasMeta = option.meta !== undefined;
  const describedBy =
    [hasDescription && descriptionId, hasMeta && metaId]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <ArkRadioGroup.Item
      value={option.value}
      disabled={option.disabled}
      className={styles.item()}
    >
      <ArkRadioGroup.ItemControl className={styles.itemControl()} />
      {option.icon !== undefined && (
        <Icon icon={option.icon} size="xl" className={styles.icon()} />
      )}
      <span className={styles.body()}>
        <ArkRadioGroup.ItemText className={styles.itemText()}>
          {option.label}
        </ArkRadioGroup.ItemText>
        {hasDescription && (
          <span id={descriptionId} className={styles.description()}>
            {option.description}
          </span>
        )}
      </span>
      {hasMeta && (
        <span id={metaId} className={styles.meta()}>
          {option.meta}
        </span>
      )}
      <ArkRadioGroup.ItemHiddenInput aria-describedby={describedBy} />
    </ArkRadioGroup.Item>
  );
};

export const RadioGroup = ({
  options,
  label,
  variant,
  className,
  ...props
}: RadioGroupProps) => {
  const styles = radioGroupStyles({ variant });

  return (
    <ArkRadioGroup.Root className={styles.root({ className })} {...props}>
      {label !== undefined && (
        <ArkRadioGroup.Label className={styles.label()}>
          {label}
        </ArkRadioGroup.Label>
      )}
      {options.map((option) => (
        <RadioItem key={option.value} option={option} styles={styles} />
      ))}
    </ArkRadioGroup.Root>
  );
};
