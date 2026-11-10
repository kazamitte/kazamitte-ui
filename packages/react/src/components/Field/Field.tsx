'use client';

import type { ComponentProps } from 'react';
import { Field as ArkField } from '@ark-ui/react';
import { tv } from '../../tv';
import { fieldSlots } from '../../variants';
import { inputStyles } from '../Input';

const fieldStyles = tv({
  slots: {
    root: fieldSlots.root,
    label: fieldSlots.label,
    control: [
      inputStyles(),
      'ark-invalid:error-border-solid',
      'ark-disabled:pointer-events-none ark-disabled:opacity-50',
    ],
    errorText: 'text-dense-14 error-fg',
    helperText: 'text-dense-14 base-fg-muted',
    requiredIndicator: 'error-fg',
  },
});

const styles = fieldStyles();

export const FieldRoot = ({
  className,
  ...props
}: ComponentProps<typeof ArkField.Root>) => (
  <ArkField.Root className={styles.root({ className })} {...props} />
);

export const FieldLabel = ({
  className,
  ...props
}: ComponentProps<typeof ArkField.Label>) => (
  <ArkField.Label className={styles.label({ className })} {...props} />
);

export const FieldInput = ({
  className,
  ...props
}: ComponentProps<typeof ArkField.Input>) => (
  <ArkField.Input className={styles.control({ className })} {...props} />
);

export const FieldTextarea = ({
  className,
  ...props
}: ComponentProps<typeof ArkField.Textarea>) => (
  <ArkField.Textarea
    className={styles.control({
      className: ['min-h-20 resize-y', className],
    })}
    {...props}
  />
);

export const FieldSelect = ({
  className,
  ...props
}: ComponentProps<typeof ArkField.Select>) => (
  <ArkField.Select
    className={styles.control({ className: ['cursor-default', className] })}
    {...props}
  />
);

export const FieldErrorText = ({
  className,
  ...props
}: ComponentProps<typeof ArkField.ErrorText>) => (
  <ArkField.ErrorText className={styles.errorText({ className })} {...props} />
);

export const FieldHelperText = ({
  className,
  ...props
}: ComponentProps<typeof ArkField.HelperText>) => (
  <ArkField.HelperText
    className={styles.helperText({ className })}
    {...props}
  />
);

export const FieldRequiredIndicator = ({
  className,
  ...props
}: ComponentProps<typeof ArkField.RequiredIndicator>) => (
  <ArkField.RequiredIndicator
    className={styles.requiredIndicator({ className })}
    {...props}
  />
);

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Input: FieldInput,
  Textarea: FieldTextarea,
  Select: FieldSelect,
  ErrorText: FieldErrorText,
  HelperText: FieldHelperText,
  RequiredIndicator: FieldRequiredIndicator,
};
