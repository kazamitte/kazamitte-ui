'use client';

import type { ReactNode } from 'react';
import { Editable as ArkEditable } from '@ark-ui/react';
import { tv } from '../../tv';
import { fieldSlots, focusRing } from '../../variants';
import { Button } from '../Button';
import { inputStyles } from '../Input';

const editableStyles = tv({
  slots: {
    root: fieldSlots.root,
    label: fieldSlots.label,
    area: 'grid',
    preview: [
      inputStyles(),
      'cursor-text border-transparent',
      'hover:base-border-muted',
      'ark-placeholder-shown:base-fg-muted',
      'ark-invalid:error-border-solid',
      'ark-disabled:pointer-events-none ark-disabled:opacity-50',
      'ark-readonly:cursor-default',
    ],
    input: [
      inputStyles(),
      'ark-invalid:error-border-solid',
      'ark-disabled:pointer-events-none ark-disabled:opacity-50',
    ],
    control: 'flex gap-2',
  },
  variants: {
    multiline: {
      true: {
        preview: 'min-h-20 whitespace-pre-wrap',
        input: 'min-h-20 resize-y',
      },
    },
  },
  defaultVariants: { multiline: false },
});

const defaultTranslations: ArkEditable.RootProps['translations'] = {
  // Empty on purpose: Ark's English aria-label would beat the visible <label>.
  input: '',
  edit: '編集',
  submit: '保存',
  cancel: 'キャンセル',
};

type EditableProps = Omit<ArkEditable.RootProps, 'children'> & {
  label?: ReactNode;
  controls?: boolean;
  multiline?: boolean;
};

const styles = editableStyles();

const Controls = () => (
  <ArkEditable.Context>
    {(editable) => (
      <ArkEditable.Control className={styles.control()}>
        {editable.editing ? (
          <>
            <ArkEditable.SubmitTrigger asChild>
              <Button size="sm">保存</Button>
            </ArkEditable.SubmitTrigger>
            <ArkEditable.CancelTrigger asChild>
              <Button size="sm" variant="outline">
                キャンセル
              </Button>
            </ArkEditable.CancelTrigger>
          </>
        ) : (
          <ArkEditable.EditTrigger asChild>
            <Button size="sm" variant="outline">
              編集
            </Button>
          </ArkEditable.EditTrigger>
        )}
      </ArkEditable.Control>
    )}
  </ArkEditable.Context>
);

export const Editable = ({
  label,
  controls = false,
  multiline = false,
  translations,
  className,
  ...props
}: EditableProps) => {
  const slots = editableStyles({ multiline });
  return (
    <ArkEditable.Root
      className={slots.root({ className })}
      translations={{ ...defaultTranslations, ...translations }}
      {...props}
    >
      {label !== undefined && (
        <ArkEditable.Label className={slots.label()}>{label}</ArkEditable.Label>
      )}
      <ArkEditable.Area className={slots.area()}>
        {multiline ? (
          <ArkEditable.Input className={slots.input()} asChild>
            <textarea />
          </ArkEditable.Input>
        ) : (
          <ArkEditable.Input className={slots.input()} />
        )}
        <ArkEditable.Preview
          className={slots.preview({ className: focusRing() })}
        />
      </ArkEditable.Area>
      {controls && <Controls />}
    </ArkEditable.Root>
  );
};
