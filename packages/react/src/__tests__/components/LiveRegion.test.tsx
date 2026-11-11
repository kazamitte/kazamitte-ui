import { renderToString } from 'react-dom/server';
import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveRegion, useAnnounce } from '../../components/LiveRegion';
import { UIProvider } from '../../components/UIProvider';

const settle = async () => {
  await act(() => vi.advanceTimersByTimeAsync(100));
  await act(() => vi.advanceTimersByTimeAsync(10));
};

describe('LiveRegion', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders empty on the first commit so the text arrives as a change', () => {
    expect(renderToString(<LiveRegion>保存しました</LiveRegion>)).not.toContain(
      '保存しました',
    );
  });

  it('shows its children after it has mounted empty', async () => {
    render(<LiveRegion>保存しました</LiveRegion>);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await settle();
    expect(screen.getByRole('status')).toHaveTextContent('保存しました');
  });

  it('is a polite atomic status by default', () => {
    render(<LiveRegion />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
  });

  it('becomes an assertive alert with politeness="assertive"', () => {
    render(<LiveRegion politeness="assertive" />);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('updates when the children change', async () => {
    const { rerender } = render(<LiveRegion>1件</LiveRegion>);
    await settle();
    rerender(<LiveRegion>2件</LiveRegion>);
    await settle();
    expect(screen.getByRole('status')).toHaveTextContent('2件');
  });
});

describe('useAnnounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  const setup = () =>
    renderHook(() => useAnnounce(), {
      wrapper: ({ children }) => (
        <UIProvider locale="ja-JP">{children}</UIProvider>
      ),
    });

  it('mounts two empty regions in UIProvider', () => {
    render(<UIProvider locale="ja-JP">x</UIProvider>);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  });

  it('puts a message into the polite region by default', async () => {
    const { result } = setup();
    act(() => result.current('保存しました'));
    await settle();
    expect(screen.getByRole('status')).toHaveTextContent('保存しました');
    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  });

  it('puts an assertive message into the alert region', async () => {
    const { result } = setup();
    act(() => result.current('失敗しました', { politeness: 'assertive' }));
    await settle();
    expect(screen.getByRole('alert')).toHaveTextContent('失敗しました');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('empties the region before refilling so the same text is announced again', async () => {
    const { result } = setup();
    act(() => result.current('保存しました'));
    await settle();
    act(() => result.current('保存しました'));
    await act(() => vi.advanceTimersByTimeAsync(10));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await settle();
    expect(screen.getByRole('status')).toHaveTextContent('保存しました');
  });

  it('creates its own region in the body outside UIProvider', async () => {
    const { result } = renderHook(() => useAnnounce());
    act(() => result.current('保存しました'));
    await settle();
    expect(screen.getByRole('status')).toHaveTextContent('保存しました');
  });

  it('refills the fallback region too when the same text repeats', async () => {
    const { result } = renderHook(() => useAnnounce());
    act(() => result.current('保存しました'));
    await settle();
    act(() => result.current('保存しました'));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await settle();
    expect(screen.getByRole('status')).toHaveTextContent('保存しました');
  });
});
