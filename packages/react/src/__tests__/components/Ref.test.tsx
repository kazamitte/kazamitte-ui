import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Field } from '../../components/Field';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';

describe('ref forwarding', () => {
  it('gives the Field.Input element so it can be focused', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Field.Root>
        <Field.Input ref={ref} />
      </Field.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  });

  it('gives the Field.Textarea element so it can be focused', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <Field.Root>
        <Field.Textarea ref={ref} />
      </Field.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  });

  it('gives the Input element so it can be focused', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="名前" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  });

  it('gives the Textarea element so it can be focused', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="本文" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  });

  it('forwards the ref of a plain wrapper to its element', () => {
    const card = createRef<HTMLDivElement>();
    const empty = createRef<HTMLDivElement>();
    render(
      <>
        <Card.Root ref={card} />
        <EmptyState.Root ref={empty} />
      </>,
    );
    expect(card.current).toBeInstanceOf(HTMLDivElement);
    expect(empty.current).toBeInstanceOf(HTMLDivElement);
  });
});
