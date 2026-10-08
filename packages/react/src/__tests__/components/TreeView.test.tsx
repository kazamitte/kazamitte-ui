import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TreeView, type TreeNode } from '../../components/TreeView';

const NODES: TreeNode[] = [
  {
    id: 'src',
    name: 'src',
    children: [
      { id: 'src/app.tsx', name: 'app.tsx' },
      {
        id: 'src/ui',
        name: 'ui',
        children: [{ id: 'src/ui/Button.tsx', name: 'Button.tsx' }],
      },
    ],
  },
  { id: 'package.json', name: 'package.json' },
];

describe('TreeView', () => {
  it('renders a tree named by the label with collapsed branches and leaf items', () => {
    render(<TreeView label="ファイル" nodes={NODES} />);
    const tree = screen.getByRole('tree', { name: 'ファイル' });
    expect(tree).toBeInTheDocument();
    const branch = screen.getByRole('treeitem', { name: 'src' });
    expect(branch).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.getByRole('treeitem', { name: 'package.json' }),
    ).not.toHaveAttribute('aria-expanded');
    expect(screen.queryByText('app.tsx')).not.toBeVisible();
  });

  it('names the tree ツリー when no label is given', () => {
    render(<TreeView nodes={NODES} />);
    expect(screen.getByRole('tree', { name: 'ツリー' })).toBeInTheDocument();
  });

  it('opens a branch on click and reports the expanded ids', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(<TreeView nodes={NODES} onExpandedChange={onExpandedChange} />);
    const branch = screen.getByRole('treeitem', { name: 'src' });
    await user.click(screen.getByText('src'));
    await waitFor(() =>
      expect(branch).toHaveAttribute('aria-expanded', 'true'),
    );
    expect(screen.getByRole('treeitem', { name: 'app.tsx' })).toBeVisible();
    expect(onExpandedChange).toHaveBeenCalledWith(
      expect.objectContaining({ expandedValue: ['src'] }),
    );
  });

  it('starts with the branches in defaultExpandedValue open', () => {
    render(<TreeView nodes={NODES} defaultExpandedValue={['src', 'src/ui']} />);
    expect(screen.getByRole('treeitem', { name: 'Button.tsx' })).toBeVisible();
  });

  it('selects an item and reports the selected ids', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<TreeView nodes={NODES} onSelectionChange={onSelectionChange} />);
    const item = screen.getByRole('treeitem', { name: 'package.json' });
    await user.click(screen.getByText('package.json'));
    expect(item).toHaveAttribute('aria-selected', 'true');
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ selectedValue: ['package.json'] }),
    );
  });

  it('moves through the nodes with the arrow keys and opens a branch with ArrowRight', async () => {
    const user = userEvent.setup();
    render(<TreeView nodes={NODES} />);
    await user.tab();
    const branch = screen.getByRole('treeitem', { name: 'src' });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'src' })).toHaveFocus(),
    );
    await user.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(branch).toHaveAttribute('aria-expanded', 'true'),
    );
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('treeitem', { name: 'app.tsx' })).toHaveFocus(),
    );
  });

  it('keeps several items selected with selectionMode="multiple"', async () => {
    const user = userEvent.setup();
    render(
      <TreeView
        nodes={NODES}
        selectionMode="multiple"
        defaultExpandedValue={['src']}
      />,
    );
    await user.click(screen.getByText('package.json'));
    await user.keyboard('{Control>}');
    await user.click(screen.getByText('app.tsx'));
    await user.keyboard('{/Control}');
    expect(
      screen
        .getAllByRole('treeitem', { selected: true })
        .map((el) => el.textContent?.trim()),
    ).toEqual(['app.tsx', 'package.json']);
  });

  it('draws an indent guide under open branches when asked', () => {
    const { container } = render(
      <TreeView nodes={NODES} defaultExpandedValue={['src']} indentGuide />,
    );
    expect(
      container.querySelector('[data-part="branch-indent-guide"]'),
    ).toBeInTheDocument();
  });
});
