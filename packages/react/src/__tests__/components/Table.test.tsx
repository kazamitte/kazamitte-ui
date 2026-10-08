import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table } from '../../components/Table';

const renderTable = (
  props: React.ComponentProps<typeof Table.Root> = {},
  rowProps: React.ComponentProps<typeof Table.Row> = {},
) =>
  render(
    <Table.ScrollArea>
      <Table.Root {...props}>
        <Table.Caption>コンポーネント一覧</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader aria-sort="ascending">名前</Table.ColumnHeader>
            <Table.ColumnHeader align="end">数</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row {...rowProps}>
            <Table.Cell>Button</Table.Cell>
            <Table.Cell align="end">4</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>,
  );

describe('Table', () => {
  it('renders a semantic table with caption, column headers and cells', () => {
    renderTable();
    expect(
      screen.getByRole('table', { name: 'コンポーネント一覧' }),
    ).toBeInTheDocument();
    const header = screen.getByRole('columnheader', { name: '名前' });
    expect(header).toHaveAttribute('scope', 'col');
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByRole('cell', { name: 'Button' })).toBeInTheDocument();
  });

  it('makes a ColumnHeader in Body a row header', () => {
    render(
      <Table.Root>
        <Table.Body>
          <Table.Row>
            <Table.ColumnHeader>bg</Table.ColumnHeader>
            <Table.Cell>Aa</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByRole('rowheader', { name: 'bg' })).toHaveAttribute(
      'scope',
      'row',
    );
  });

  it('makes a ColumnHeader in Footer a row header', () => {
    render(
      <Table.Root>
        <Table.Footer>
          <Table.Row>
            <Table.ColumnHeader>合計</Table.ColumnHeader>
            <Table.Cell>4</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>,
    );
    expect(screen.getByRole('rowheader', { name: '合計' })).toHaveAttribute(
      'scope',
      'row',
    );
  });

  it('passes a ref through to the cell element', () => {
    const ref = createRef<HTMLTableCellElement>();
    render(
      <Table.Root>
        <Table.Body>
          <Table.Row>
            <Table.Cell ref={ref}>Aa</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(ref.current).toBe(screen.getByRole('cell', { name: 'Aa' }));
  });

  it('announces a selected row with aria-selected', () => {
    renderTable({ interactive: true }, { selected: true });
    const row = screen.getByRole('row', { name: 'Button 4' });
    expect(row).toHaveAttribute('aria-selected', 'true');
  });

  it('leaves aria-selected off a row that is not selected', () => {
    renderTable({ interactive: true });
    const row = screen.getByRole('row', { name: 'Button 4' });
    expect(row).not.toHaveAttribute('aria-selected');
  });

  it('labels the scroll area with a caption that has its own id', () => {
    render(
      <Table.ScrollArea>
        <Table.Root>
          <Table.Caption id="custom">独自の見出し</Table.Caption>
          <Table.Body>
            <Table.Row>
              <Table.Cell>値</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>,
    );
    const region = screen.getByRole('region', { name: '独自の見出し' });
    expect(region).toHaveAttribute('aria-labelledby', 'custom');
  });

  it('drops the region role when the caption is removed', () => {
    const table = (withCaption: boolean) => (
      <Table.ScrollArea>
        <Table.Root>
          {withCaption && <Table.Caption>見出し</Table.Caption>}
          <Table.Body>
            <Table.Row>
              <Table.Cell>値</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    );
    const { rerender } = render(table(true));
    expect(screen.getByRole('region', { name: '見出し' })).toBeInTheDocument();
    rerender(table(false));
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('makes the scroll area keyboard-reachable and names it after the caption', () => {
    renderTable();
    const region = screen.getByRole('region', { name: 'コンポーネント一覧' });
    expect(region).toHaveAttribute('tabIndex', '0');
  });

  it('lets a caller override the scroll area tabIndex', () => {
    render(
      <Table.ScrollArea tabIndex={-1}>
        <Table.Root>
          <Table.Caption>設定なし</Table.Caption>
          <Table.Body>
            <Table.Row>
              <Table.Cell>値</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>,
    );
    expect(screen.getByRole('region')).toHaveAttribute('tabIndex', '-1');
  });

  it('renders the scroll area without a region role when there is no caption', () => {
    render(
      <Table.ScrollArea>
        <Table.Root>
          <Table.Body>
            <Table.Row>
              <Table.Cell>値</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>,
    );
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});
