import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Pagination } from '../../components/Pagination';

describe('Pagination', () => {
  it('activates a focused page button with a real Enter key press (type="button")', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={30} pageSize={10} onPageChange={onPageChange} />);
    const page2 = screen.getByRole('button', {
      name: '2ページ目（全3ページ）',
    });
    page2.focus();
    expect(page2).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(onPageChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
  });

  it('activates a focused page button with a real Space key press (type="button")', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={30} pageSize={10} onPageChange={onPageChange} />);
    const page2 = screen.getByRole('button', {
      name: '2ページ目（全3ページ）',
    });
    page2.focus();
    expect(page2).toHaveFocus();

    await userEvent.keyboard('[Space]');
    expect(onPageChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
  });

  it('activates a focused page link with a real Enter key press (type="link")', async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        count={30}
        pageSize={10}
        type="link"
        getPageUrl={({ page }) => `#page-${page}`}
        onPageChange={onPageChange}
      />,
    );
    const page2 = screen.getByRole('link', { name: '2ページ目（全3ページ）' });
    page2.focus();
    expect(page2).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(onPageChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
  });

  it('does not activate a focused page link with a real Space key press (type="link")', async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        count={30}
        pageSize={10}
        type="link"
        getPageUrl={({ page }) => `#page-${page}`}
        onPageChange={onPageChange}
      />,
    );
    const page2 = screen.getByRole('link', { name: '2ページ目（全3ページ）' });
    page2.focus();
    expect(page2).toHaveFocus();

    await userEvent.keyboard('[Space]');
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
