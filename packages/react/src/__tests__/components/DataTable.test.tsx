import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createDataTableColumns, DataTable } from '../../components/DataTable';

type Row = { id: string; name: string; age: number };

const ROWS: Row[] = [
  { id: 'a', name: 'Ada', age: 36 },
  { id: 'b', name: 'Grace', age: 41 },
  { id: 'c', name: 'Linus', age: 29 },
];

const helper = createDataTableColumns<Row>();
const COLUMNS = helper.columns([
  helper.accessor('name', { header: '名前' }),
  helper.accessor('age', { header: '年齢', meta: { align: 'end' } }),
]);

const firstColumnCells = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0]?.textContent);

describe('DataTable', () => {
  it('renders the rows as a captioned table with sortable column headers', () => {
    render(<DataTable columns={COLUMNS} data={ROWS} caption="メンバー" />);
    expect(screen.getByRole('table', { name: 'メンバー' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '名前' })).toBeInTheDocument();
    expect(firstColumnCells()).toEqual(['Ada', 'Grace', 'Linus']);
  });

  it('sorts by a column on click and exposes the direction through aria-sort', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={COLUMNS} data={ROWS} />);
    const header = screen.getByRole('columnheader', { name: '年齢' });
    expect(header).not.toHaveAttribute('aria-sort');

    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(firstColumnCells()).toEqual(['Linus', 'Ada', 'Grace']);

    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(firstColumnCells()).toEqual(['Grace', 'Ada', 'Linus']);
  });

  it('selects rows through labelled checkboxes and reports them', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={ROWS}
        getRowId={(row) => row.id}
        selectable
        rowLabel={(row) => row.name}
        onSelectionChange={onSelectionChange}
      />,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Graceを選択' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([ROWS[1]]);
    expect(screen.getByRole('row', { selected: true })).toHaveTextContent(
      'Grace',
    );

    await user.click(
      screen.getByRole('checkbox', { name: 'このページの行をすべて選択' }),
    );
    expect(onSelectionChange).toHaveBeenLastCalledWith(ROWS);
  });

  it('pages the rows and moves through them with the pagination', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={COLUMNS} data={ROWS} pageSize={2} />);
    expect(firstColumnCells()).toEqual(['Ada', 'Grace']);
    expect(screen.getByText('全3件中 1–2件')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '次のページ' }));
    expect(firstColumnCells()).toEqual(['Linus']);
    expect(screen.getByText('全3件中 3–3件')).toBeInTheDocument();
  });

  it('re-pages the rows when the pageSize prop changes on rerender', () => {
    const { rerender } = render(
      <DataTable columns={COLUMNS} data={ROWS} pageSize={2} />,
    );
    expect(firstColumnCells()).toEqual(['Ada', 'Grace']);
    expect(screen.getByText('全3件中 1–2件')).toBeInTheDocument();

    rerender(<DataTable columns={COLUMNS} data={ROWS} pageSize={1} />);
    expect(firstColumnCells()).toEqual(['Ada']);
    expect(screen.getByText('全3件中 1–1件')).toBeInTheDocument();
  });

  it('does not call onSelectionChange on mount with an empty selection', async () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={ROWS}
        getRowId={(row) => row.id}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await waitFor(() => {
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  it('reports the selected row again when its data changes for the same id', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { rerender } = render(
      <DataTable
        columns={COLUMNS}
        data={ROWS}
        getRowId={(row) => row.id}
        selectable
        rowLabel={(row) => row.name}
        onSelectionChange={onSelectionChange}
      />,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Graceを選択' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([ROWS[1]]);

    const updatedGrace = { ...ROWS[1], age: 42 };
    const updatedRows = ROWS.map((row) =>
      row.id === 'b' ? updatedGrace : row,
    );
    rerender(
      <DataTable
        columns={COLUMNS}
        data={updatedRows}
        getRowId={(row) => row.id}
        selectable
        rowLabel={(row) => row.name}
        onSelectionChange={onSelectionChange}
      />,
    );
    expect(onSelectionChange).toHaveBeenLastCalledWith([updatedGrace]);
  });

  it('shows the empty message across the columns when there are no rows', () => {
    render(<DataTable columns={COLUMNS} data={[]} emptyMessage="該当なし" />);
    expect(screen.getByRole('cell', { name: '該当なし' })).toHaveAttribute(
      'colspan',
      '2',
    );
  });
});
