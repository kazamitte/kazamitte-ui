'use client';

import { useEffect, useEffectEvent, useRef, type ReactNode } from 'react';
import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type CellData,
  type ColumnDef,
  type Header,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { tv } from '../../tv';
import { focusRing } from '../../variants';
import { Checkbox } from '../Checkbox';
import { Pagination } from '../Pagination';
import { Table } from '../Table';

export type DataTableColumnMeta = {
  align?: 'start' | 'center' | 'end';
  width?: number | string;
};

const features = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: metaHelper<DataTableColumnMeta>(),
});

export type DataTableFeatures = typeof features;

export type DataTableColumn<TData extends RowData> = ColumnDef<
  DataTableFeatures,
  TData,
  CellData
>;

export const createDataTableColumns = <TData extends RowData>() =>
  createColumnHelper<DataTableFeatures, TData>();

const dataTableStyles = tv({
  slots: {
    root: 'flex flex-col gap-3',
    sortButton: [
      '-mx-1 inline-flex items-center gap-1 rounded-tight px-1 font-semibold base-fg-strong transition-colors',
      'hover:base-bg-muted',
      focusRing(),
    ],
    sortIcon: 'size-3.5 shrink-0 base-fg-muted',
    sortIconActive: 'size-3.5 shrink-0 primary-fg',
    selectCell: 'w-10 align-middle',
    empty: 'py-8 text-center base-fg-muted',
    footer: 'flex flex-wrap items-center justify-between gap-3',
    status: 'text-dense-14 base-fg-muted tabular-nums',
  },
});

const styles = dataTableStyles();

type TableRootProps = React.ComponentProps<typeof Table.Root>;

export type DataTableProps<TData extends RowData> = Pick<
  TableRootProps,
  'size' | 'variant' | 'striped' | 'className'
> & {
  columns: readonly DataTableColumn<TData>[];
  data: readonly TData[];
  caption?: ReactNode;
  getRowId?: (row: TData, index: number) => string;
  selectable?: boolean;
  onSelectionChange?: (rows: TData[]) => void;
  rowLabel?: (row: TData) => string;
  defaultSorting?: SortingState;
  pageSize?: number;
  layout?: 'auto' | 'fixed';
  emptyMessage?: ReactNode;
};

const EMPTY: never[] = [];

const ariaSort = (
  sorted: false | 'asc' | 'desc',
): 'ascending' | 'descending' | undefined => {
  if (sorted === 'asc') return 'ascending';
  if (sorted === 'desc') return 'descending';
  return undefined;
};

const SortIcon = ({ sorted }: { sorted: false | 'asc' | 'desc' }) => {
  if (sorted === 'asc') {
    return <ArrowUp aria-hidden="true" className={styles.sortIconActive()} />;
  }
  if (sorted === 'desc') {
    return <ArrowDown aria-hidden="true" className={styles.sortIconActive()} />;
  }
  return <ArrowUpDown aria-hidden="true" className={styles.sortIcon()} />;
};

export const DataTable = <TData extends RowData>({
  columns,
  data,
  caption,
  getRowId,
  selectable = false,
  onSelectionChange,
  rowLabel,
  defaultSorting,
  pageSize,
  layout = pageSize === undefined ? 'auto' : 'fixed',
  emptyMessage = 'データがありません',
  size,
  variant,
  striped,
  className,
}: DataTableProps<TData>) => {
  const table = useTable<DataTableFeatures, TData>({
    features,
    columns,
    data,
    getRowId,
    enableRowSelection: selectable,
    sortDescFirst: false,
    initialState: {
      sorting: defaultSorting ?? EMPTY,
      pagination: { pageIndex: 0, pageSize: pageSize ?? data.length },
    },
  });

  const { pagination } = table.state;

  // TanStack copies pageSize into table state; push prop changes in by hand.
  const applyPageSize = useEffectEvent((size: number) => {
    table.setPageSize(size);
  });
  useEffect(() => {
    if (pageSize !== undefined) {
      applyPageSize(pageSize);
    }
  }, [pageSize]);

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const previousSelectedRows = useRef(selectedRows);
  const notifySelectionChange = useEffectEvent((rows: TData[]) => {
    onSelectionChange?.(rows);
  });
  useEffect(() => {
    const previous = previousSelectedRows.current;
    const unchanged =
      previous.length === selectedRows.length &&
      previous.every((row, index) => row === selectedRows[index]);
    if (unchanged) return;
    previousSelectedRows.current = selectedRows;
    notifySelectionChange(selectedRows);
  });

  const rows =
    pageSize === undefined
      ? table.getRowModel().rows
      : table.getPaginatedRowModel().rows;
  const rowCount = table.getRowCount();
  const columnCount = table.getAllLeafColumns().length + (selectable ? 1 : 0);
  const someSelected =
    table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();

  const renderHeader = (header: Header<DataTableFeatures, TData, CellData>) => {
    const column = header.column;
    const meta = column.columnDef.meta;
    const sorted = column.getIsSorted();
    return (
      <Table.ColumnHeader
        key={header.id}
        align={meta?.align}
        aria-sort={ariaSort(sorted)}
      >
        {header.isPlaceholder ? undefined : column.getCanSort() ? (
          <button
            type="button"
            className={styles.sortButton()}
            onClick={column.getToggleSortingHandler()}
          >
            <table.FlexRender header={header} />
            <SortIcon sorted={sorted} />
          </button>
        ) : (
          <table.FlexRender header={header} />
        )}
      </Table.ColumnHeader>
    );
  };

  return (
    <div className={styles.root({ className })}>
      <Table.ScrollArea>
        <Table.Root
          size={size}
          variant={variant}
          striped={striped}
          className={layout === 'fixed' ? 'table-fixed' : undefined}
        >
          {caption !== undefined && <Table.Caption>{caption}</Table.Caption>}
          {layout === 'fixed' && (
            <Table.ColumnGroup>
              {selectable && <col className="w-10" />}
              {table.getAllLeafColumns().map((column) => (
                <col
                  key={column.id}
                  style={
                    column.columnDef.meta?.width === undefined
                      ? undefined
                      : { width: column.columnDef.meta.width }
                  }
                />
              ))}
            </Table.ColumnGroup>
          )}
          <Table.Header>
            {table.getHeaderGroups().map((group) => (
              <Table.Row key={group.id}>
                {selectable && (
                  <Table.ColumnHeader className={styles.selectCell()}>
                    <Checkbox
                      className="flex"
                      aria-label="このページの行をすべて選択"
                      checked={
                        someSelected
                          ? 'indeterminate'
                          : table.getIsAllPageRowsSelected()
                      }
                      onCheckedChange={({ checked }) =>
                        table.toggleAllPageRowsSelected(checked === true)
                      }
                    />
                  </Table.ColumnHeader>
                )}
                {group.headers.map(renderHeader)}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={columnCount} className={styles.empty()}>
                  {emptyMessage}
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map((row) => (
                <Table.Row
                  key={row.id}
                  selected={selectable ? row.getIsSelected() : undefined}
                >
                  {selectable && (
                    <Table.Cell className={styles.selectCell()}>
                      <Checkbox
                        className="flex"
                        aria-label={`${rowLabel ? rowLabel(row.original) : `${row.index + 1}行目`}を選択`}
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect()}
                        onCheckedChange={({ checked }) =>
                          row.toggleSelected(checked === true)
                        }
                      />
                    </Table.Cell>
                  )}
                  {row.getAllCells().map((cell) => (
                    <Table.Cell
                      key={cell.id}
                      align={cell.column.columnDef.meta?.align}
                    >
                      <table.FlexRender cell={cell} />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      {pageSize !== undefined && rowCount > 0 && (
        <div className={styles.footer()}>
          <p className={styles.status()} aria-live="polite">
            {`全${rowCount}件中 ${pagination.pageIndex * pageSize + 1}–${Math.min((pagination.pageIndex + 1) * pageSize, rowCount)}件`}
          </p>
          {rowCount > pageSize && (
            <Pagination
              count={rowCount}
              pageSize={pageSize}
              page={pagination.pageIndex + 1}
              onPageChange={({ page }) => table.setPageIndex(page - 1)}
            />
          )}
        </div>
      )}
    </div>
  );
};
