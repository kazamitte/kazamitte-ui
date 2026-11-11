import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { List } from '../../components/List';

describe('List', () => {
  it('renders rows as native list items inside a named list', () => {
    render(
      <List.Root>
        <List.Header>
          <h2 id="h">未完了のタスク</h2>
        </List.Header>
        <List.Items aria-labelledby="h">
          <List.Row>
            <a href="#a">買い物</a>
          </List.Row>
          <List.Row>
            <a href="#b">掃除</a>
          </List.Row>
        </List.Items>
      </List.Root>,
    );
    const list = screen.getByRole('list', { name: '未完了のタスク' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
  });

  it('shows the empty text inside the box without a list', () => {
    render(
      <List.Root data-testid="root">
        <List.Empty>タスクはありません</List.Empty>
      </List.Root>,
    );
    expect(screen.getByTestId('root')).toHaveTextContent('タスクはありません');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders the requested number of placeholder rows, hidden from assistive tech', () => {
    const { container } = render(
      <List.Root>
        <List.Skeleton rows={4} />
      </List.Root>,
    );
    expect(
      container.querySelectorAll('[data-part="skeleton-row"]'),
    ).toHaveLength(4);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(8);
  });

  it('defaults to three placeholder rows', () => {
    const { container } = render(<List.Skeleton />);
    expect(
      container.querySelectorAll('[data-part="skeleton-row"]'),
    ).toHaveLength(3);
  });

  it('makes the header sticky only when asked', () => {
    render(
      <>
        <List.Header sticky data-testid="sticky">
          a
        </List.Header>
        <List.Header data-testid="plain">b</List.Header>
      </>,
    );
    expect(screen.getByTestId('sticky')).toHaveClass('sticky', 'top-0');
    expect(screen.getByTestId('plain')).not.toHaveClass('sticky');
  });

  it('does not clip its content, so a sticky header keeps working', () => {
    render(<List.Root data-testid="root" />);
    expect(screen.getByTestId('root')).not.toHaveClass('overflow-hidden');
  });

  it('renders as another element with asChild', () => {
    render(
      <List.Root asChild>
        <section aria-label="タスク" />
      </List.Root>,
    );
    expect(screen.getByRole('region', { name: 'タスク' })).toBeInTheDocument();
  });

  it('forwards refs to every part', () => {
    const root = createRef<HTMLDivElement>();
    const header = createRef<HTMLDivElement>();
    const items = createRef<HTMLUListElement>();
    const row = createRef<HTMLLIElement>();
    const empty = createRef<HTMLDivElement>();
    const skeleton = createRef<HTMLDivElement>();
    render(
      <List.Root ref={root}>
        <List.Header ref={header} />
        <List.Items ref={items}>
          <List.Row ref={row} />
        </List.Items>
        <List.Empty ref={empty} />
        <List.Skeleton ref={skeleton} />
      </List.Root>,
    );
    expect(root.current).toBeInstanceOf(HTMLDivElement);
    expect(header.current).toBeInstanceOf(HTMLDivElement);
    expect(items.current).toBeInstanceOf(HTMLUListElement);
    expect(row.current).toBeInstanceOf(HTMLLIElement);
    expect(empty.current).toBeInstanceOf(HTMLDivElement);
    expect(skeleton.current).toBeInstanceOf(HTMLDivElement);
  });
});
