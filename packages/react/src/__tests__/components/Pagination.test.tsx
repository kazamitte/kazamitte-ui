import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../../components/Pagination';

describe('Pagination', () => {
  it('is a labelled navigation with one button per page and the current page marked', () => {
    render(<Pagination count={30} pageSize={10} />);
    const nav = screen.getByRole('navigation', { name: 'ページネーション' });
    expect(
      within(nav).getByRole('button', { name: '1ページ目（全3ページ）' }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      within(nav).getByRole('button', { name: '3ページ目（全3ページ）' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('moves to the next page and reports the change', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={30} pageSize={10} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: '次のページ' }));
    expect(onPageChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
    expect(
      screen.getByRole('button', { name: '2ページ目（全3ページ）' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('collapses distant pages into an ellipsis', () => {
    render(<Pagination count={200} pageSize={10} defaultPage={10} />);
    expect(screen.getAllByText('…')).toHaveLength(2);
    expect(
      screen.queryByRole('button', { name: '5ページ目（全20ページ）' }),
    ).not.toBeInTheDocument();
  });

  it('renders links instead of buttons for a static site', () => {
    render(
      <Pagination
        count={30}
        pageSize={10}
        type="link"
        getPageUrl={({ page }) => `https://example.com/blog/page/${page}`}
      />,
    );
    expect(
      screen.getByRole('link', { name: '2ページ目（全3ページ）' }),
    ).toHaveAttribute('href', 'https://example.com/blog/page/2');
  });

  it('disables prev on the first page and next on the last page for buttons', () => {
    const { unmount } = render(<Pagination count={30} pageSize={10} />);
    expect(screen.getByRole('button', { name: '前のページ' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '次のページ' })).toBeEnabled();
    unmount();
    render(<Pagination count={30} pageSize={10} defaultPage={3} />);
    expect(screen.getByRole('button', { name: '次のページ' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '前のページ' })).toBeEnabled();
  });

  it('marks the boundary next link on the last page as unavailable', () => {
    render(
      <Pagination
        count={30}
        pageSize={10}
        defaultPage={3}
        type="link"
        getPageUrl={({ page }) => `https://example.com/blog/page/${page}`}
      />,
    );
    const next = screen.getByRole('link', { name: '次のページ' });
    expect(next).toHaveAttribute('aria-disabled', 'true');
    expect(next).not.toHaveAttribute('href');
  });

  it('overrides one translation and keeps the other Japanese defaults', () => {
    render(
      <Pagination
        count={30}
        pageSize={10}
        translations={{ nextTriggerLabel: 'Next' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '前のページ' }),
    ).toBeInTheDocument();
  });

  it('marks the boundary prev link as unavailable instead of dropping its role', () => {
    render(
      <Pagination
        count={30}
        pageSize={10}
        type="link"
        getPageUrl={({ page }) => `https://example.com/blog/page/${page}`}
      />,
    );
    const prev = screen.getByRole('link', { name: '前のページ' });
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(prev).not.toHaveAttribute('href');
  });
});
