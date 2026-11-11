'use client';

import type { ComponentProps, ReactNode, Ref } from 'react';
import { DateInput as ArkDateInput } from '@ark-ui/react/date-input';
import { useFieldContext } from '@ark-ui/react/field';
import { setRef } from '../../setRef';
import { tv } from '../../tv';
import { fieldSlots } from '../../variants';
import { inputStyles } from '../Input';

const dateInputStyles = tv({
  slots: {
    root: fieldSlots.root,
    label: fieldSlots.label,
    control: 'flex flex-wrap items-center gap-2',
    segmentGroup: [
      inputStyles(),
      'flex w-auto min-w-0 flex-1 cursor-text items-center gap-px',
      'ark-focus:primary-border-solid',
      'ark-invalid:error-border-solid',
      'ark-disabled:pointer-events-none ark-disabled:opacity-50',
      'ark-readonly:base-bg-subtle',
    ],
    segment: [
      'inline-flex min-w-[2ch] items-center justify-center rounded-tight px-0.5 text-center tabular-nums [caret-color:transparent] outline-none',
      'ark-placeholder-shown:base-fg-muted',
      'focus:primary-bg-solid focus:primary-fg-contrast',
      'ark-literal:min-w-0 ark-literal:px-0 ark-literal:base-fg-muted ark-literal:select-none',
    ],
    separator: 'text-dense-14 base-fg-muted',
  },
});

const styles = dateInputStyles();

type DateInputProps = Omit<
  ComponentProps<typeof ArkDateInput.Root>,
  'children'
> & {
  label?: ReactNode;
  rangeSeparator?: string;
  inputRef?: Ref<HTMLElement>;
};

// Segments are spans, not inputs: the first editable one is the focus target.
const firstSegmentRef =
  (inputRef: Ref<HTMLElement> | undefined) => (el: HTMLElement | null) => {
    if (el?.parentElement?.querySelector('[role="spinbutton"]') !== el) return;
    setRef(inputRef, el);
    return () => {
      setRef(inputRef, null);
    };
  };

// Each spinbutton segment is the focus target, so it carries the description
// itself: a screen reader reads it on focus, whereas a description on the
// role="group" wrapper is only announced inconsistently when entering it.
const Segments = ({ inputRef }: { inputRef?: Ref<HTMLElement> }) => {
  const field = useFieldContext();
  return (
    <ArkDateInput.SegmentContext>
      {(segment) => (
        <ArkDateInput.Segment
          ref={inputRef ? firstSegmentRef(inputRef) : undefined}
          segment={segment}
          aria-describedby={
            segment.type === 'literal' ? undefined : field?.ariaDescribedby
          }
          className={styles.segment()}
        />
      )}
    </ArkDateInput.SegmentContext>
  );
};

export const DateInput = ({
  label,
  rangeSeparator = '〜',
  selectionMode,
  shouldForceLeadingZeros = true,
  inputRef,
  className,
  ...props
}: DateInputProps) => {
  const isRange = selectionMode === 'range';
  const field = useFieldContext();
  return (
    <ArkDateInput.Root
      selectionMode={selectionMode}
      shouldForceLeadingZeros={shouldForceLeadingZeros}
      invalid={field?.invalid}
      disabled={field?.disabled}
      readOnly={field?.readOnly}
      required={field?.required}
      className={styles.root({ className })}
      {...props}
    >
      {label !== undefined && (
        <ArkDateInput.Label className={styles.label()}>
          {label}
        </ArkDateInput.Label>
      )}
      <ArkDateInput.Control className={styles.control()}>
        <ArkDateInput.SegmentGroup index={0} className={styles.segmentGroup()}>
          <Segments inputRef={inputRef} />
        </ArkDateInput.SegmentGroup>
        {isRange && (
          <>
            <span className={styles.separator()} aria-hidden="true">
              {rangeSeparator}
            </span>
            <ArkDateInput.SegmentGroup
              index={1}
              className={styles.segmentGroup()}
            >
              <Segments />
            </ArkDateInput.SegmentGroup>
          </>
        )}
      </ArkDateInput.Control>
      <ArkDateInput.HiddenInput index={0} />
      {isRange && <ArkDateInput.HiddenInput index={1} />}
    </ArkDateInput.Root>
  );
};
