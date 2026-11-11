import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '../../components/Card';
import { ColorPicker } from '../../components/ColorPicker';
import { Combobox } from '../../components/Combobox';
import { DateInput } from '../../components/DateInput';
import { DatePicker } from '../../components/DatePicker';
import { Editable } from '../../components/Editable';
import { EmptyState } from '../../components/EmptyState';
import { Field } from '../../components/Field';
import { Input } from '../../components/Input';
import { Listbox } from '../../components/Listbox';
import { NumberInput } from '../../components/NumberInput';
import { PasswordInput } from '../../components/PasswordInput';
import { Select } from '../../components/Select';
import { TagsInput } from '../../components/TagsInput';
import { Textarea } from '../../components/Textarea';
import { TreeView } from '../../components/TreeView';

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

describe('inner control refs on composite components', () => {
  const items = [{ value: 'a', label: 'A' }];
  const nodes = [{ id: 'n1', name: 'one' }];

  const expectFocusable = (ref: { current: HTMLElement | null }) => {
    expect(ref.current).toBeInstanceOf(HTMLElement);
    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  };

  it('gives the Select trigger button through triggerRef', () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const root = createRef<HTMLDivElement>();
    render(<Select items={items} ref={root} triggerRef={triggerRef} />);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(root.current).toBeInstanceOf(HTMLDivElement);
    expectFocusable(triggerRef);
  });

  it('gives the Combobox input through inputRef', () => {
    const inputRef = createRef<HTMLInputElement>();
    render(<Combobox items={items} label="x" inputRef={inputRef} />);
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expectFocusable(inputRef);
  });

  it('gives the DatePicker input through inputRef', () => {
    const inputRef = createRef<HTMLInputElement>();
    render(<DatePicker label="x" inputRef={inputRef} />);
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expectFocusable(inputRef);
  });

  it('gives the TagsInput input through inputRef', () => {
    const inputRef = createRef<HTMLInputElement>();
    render(<TagsInput label="x" inputRef={inputRef} />);
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expectFocusable(inputRef);
  });

  it('gives the NumberInput input through inputRef', () => {
    const inputRef = createRef<HTMLInputElement>();
    render(<NumberInput label="x" inputRef={inputRef} />);
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expectFocusable(inputRef);
  });

  it('gives the PasswordInput input through inputRef', () => {
    const inputRef = createRef<HTMLInputElement>();
    render(<PasswordInput label="x" inputRef={inputRef} />);
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expectFocusable(inputRef);
  });

  it('gives the first DateInput segment through inputRef', () => {
    const inputRef = createRef<HTMLElement>();
    render(<DateInput label="x" inputRef={inputRef} />);
    expect(inputRef.current).toHaveAttribute('role', 'spinbutton');
    expect(inputRef.current).toBe(screen.getAllByRole('spinbutton')[0]);
    expectFocusable(inputRef);
  });

  it('gives the ColorPicker hex input through inputRef', () => {
    const inputRef = createRef<HTMLInputElement>();
    render(<ColorPicker label="x" inputRef={inputRef} />);
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expectFocusable(inputRef);
  });

  it('gives the Editable input through inputRef while editing', () => {
    const inputRef = createRef<HTMLInputElement | HTMLTextAreaElement>();
    render(<Editable label="x" defaultEdit inputRef={inputRef} />);
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expectFocusable(inputRef);
  });

  it('gives the Editable textarea through inputRef when multiline', () => {
    const inputRef = createRef<HTMLInputElement | HTMLTextAreaElement>();
    render(<Editable label="x" multiline defaultEdit inputRef={inputRef} />);
    expect(inputRef.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('gives the Listbox content through contentRef', () => {
    const contentRef = createRef<HTMLDivElement>();
    render(<Listbox items={items} label="x" contentRef={contentRef} />);
    expect(contentRef.current).toHaveAttribute('role', 'listbox');
    expectFocusable(contentRef);
  });

  it('gives the TreeView tree through treeRef', () => {
    const treeRef = createRef<HTMLDivElement>();
    render(<TreeView nodes={nodes} label="x" treeRef={treeRef} />);
    expect(treeRef.current).toHaveAttribute('role', 'tree');
    expectFocusable(treeRef);
  });
});
