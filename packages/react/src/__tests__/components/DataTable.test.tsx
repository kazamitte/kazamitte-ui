import { act, render, screen, waitFor, within } from '@testing-library/react';
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
    expect(screen.getByRole('button', { name: '年齢' })).toBeInTheDocument();
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
    await act(() => Promise.resolve());
    expect(onSelectionChange).not.toHaveBeenCalled();
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

  it('shows the default empty message when there are no rows', () => {
    render(<DataTable columns={COLUMNS} data={[]} />);
    expect(
      screen.getByRole('cell', { name: 'データがありません' }),
    ).toBeInTheDocument();
  });

  it('names row checkboxes by position when no rowLabel is given', () => {
    render(<DataTable columns={COLUMNS} data={ROWS} selectable />);
    expect(
      screen.getByRole('checkbox', { name: '1行目を選択' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: '3行目を選択' }),
    ).toBeInTheDocument();
  });

  it('selects and deselects every row from the header checkbox', async () => {
    const user = userEvent.setup();
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
    const all = screen.getByRole('checkbox', {
      name: 'このページの行をすべて選択',
    });
    await user.click(screen.getByRole('checkbox', { name: '1行目を選択' }));
    await waitFor(() => expect(all).toBePartiallyChecked());

    await user.click(all);
    expect(onSelectionChange).toHaveBeenLastCalledWith(ROWS);
    await waitFor(() => expect(all).toBeChecked());

    await user.click(all);
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
    expect(screen.queryByRole('row', { selected: true })).toBeNull();
  });

  it('renders no sort button for a column with sorting disabled', () => {
    const plain = helper.columns([
      helper.accessor('name', { header: '名前', enableSorting: false }),
      helper.accessor('age', { header: '年齢' }),
    ]);
    render(<DataTable columns={plain} data={ROWS} />);
    expect(screen.queryByRole('button', { name: '名前' })).toBeNull();
    expect(screen.getByRole('columnheader', { name: '名前' })).toBeVisible();
    expect(screen.getByRole('button', { name: '年齢' })).toBeInTheDocument();
  });

  it('starts sorted by defaultSorting', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={ROWS}
        defaultSorting={[{ id: 'age', desc: true }]}
      />,
    );
    expect(screen.getByRole('columnheader', { name: '年齢' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(firstColumnCells()).toEqual(['Grace', 'Ada', 'Linus']);
  });

  it('shows the range status but no pagination when every row fits one page', () => {
    render(<DataTable columns={COLUMNS} data={ROWS} pageSize={3} />);
    expect(screen.getByText('全3件中 1–3件')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '次のページ' })).toBeNull();
  });

  it('applies meta.width to the columns when a pageSize implies a fixed layout', () => {
    const sized = helper.columns([
      helper.accessor('name', { header: '名前', meta: { width: 120 } }),
      helper.accessor('age', { header: '年齢' }),
    ]);
    const { container } = render(
      <DataTable columns={sized} data={ROWS} pageSize={2} />,
    );
    const cols = container.querySelectorAll('col');
    expect(cols).toHaveLength(2);
    expect(cols[0]).toHaveStyle({ width: '120px' });
  });

  it('leaves column widths alone when the layout is auto', () => {
    const sized = helper.columns([
      helper.accessor('name', { header: '名前', meta: { width: 120 } }),
    ]);
    const { container } = render(
      <DataTable columns={sized} data={ROWS} layout="auto" />,
    );
    expect(container.querySelectorAll('col')).toHaveLength(0);
  });

  it('shows the empty message across the columns when there are no rows', () => {
    render(<DataTable columns={COLUMNS} data={[]} emptyMessage="該当なし" />);
    expect(screen.getByRole('cell', { name: '該当なし' })).toHaveAttribute(
      'colspan',
      '2',
    );
  });
});
