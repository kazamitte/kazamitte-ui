'use client';

import type { ComponentProps } from 'react';
import { Fieldset as ArkFieldset } from '@ark-ui/react';
import { tv } from '../../tv';

const fieldsetStyles = tv({
  slots: {
    root: [
      'flex min-w-0 flex-col gap-4 border-0 p-0',
      'ark-disabled:opacity-50',
    ],
    legend: 'mb-1 text-body-18 font-semibold base-fg-strong',
    helperText: 'text-dense-14 base-fg-muted',
    errorText: 'text-dense-14 error-fg',
  },
});

const styles = fieldsetStyles();

export const FieldsetRoot = ({
  className,
  ...props
}: ComponentProps<typeof ArkFieldset.Root>) => (
  <ArkFieldset.Root className={styles.root({ className })} {...props} />
);

export const FieldsetLegend = ({
  className,
  ...props
}: ComponentProps<typeof ArkFieldset.Legend>) => (
  <ArkFieldset.Legend className={styles.legend({ className })} {...props} />
);

export const FieldsetHelperText = ({
  className,
  ...props
}: ComponentProps<typeof ArkFieldset.HelperText>) => (
  <ArkFieldset.HelperText
    className={styles.helperText({ className })}
    {...props}
  />
);

export const FieldsetErrorText = ({
  className,
  ...props
}: ComponentProps<typeof ArkFieldset.ErrorText>) => (
  <ArkFieldset.ErrorText
    className={styles.errorText({ className })}
    {...props}
  />
);
