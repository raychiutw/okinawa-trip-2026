import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PageHeader from '../../src/components/shell/PageHeader';

describe('PageHeader', () => {
  it('renders title as h1', () => {
    render(<PageHeader title="登入裝置" />);
    expect(screen.getByRole('heading', { level: 1, name: '登入裝置' })).toBeInTheDocument();
  });

  it('renders eyebrow above title when provided', () => {
    render(<PageHeader eyebrow="帳號" title="登入裝置" />);
    expect(screen.getByText('帳號')).toBeInTheDocument();
  });

  it('omits eyebrow node when not provided', () => {
    render(<PageHeader title="登入裝置" />);
    expect(document.querySelector('.tp-page-header-eyebrow')).toBeNull();
  });

  it('renders meta below title', () => {
    render(<PageHeader title="登入裝置" meta="3 個 session" />);
    expect(screen.getByText('3 個 session')).toBeInTheDocument();
  });

  it('defaults to standalone variant + left align', () => {
    render(<PageHeader title="x" />);
    const header = document.querySelector('.tp-page-header')!;
    expect(header.getAttribute('data-variant')).toBe('standalone');
    expect(header.getAttribute('data-align')).toBe('left');
  });

  it('respects sticky variant', () => {
    render(<PageHeader title="x" variant="sticky" />);
    expect(document.querySelector('.tp-page-header')!.getAttribute('data-variant')).toBe('sticky');
  });

  it('respects floating variant', () => {
    render(<PageHeader title="x" variant="floating" />);
    expect(document.querySelector('.tp-page-header')!.getAttribute('data-variant')).toBe('floating');
  });

  it('respects center align', () => {
    render(<PageHeader title="x" align="center" />);
    expect(document.querySelector('.tp-page-header')!.getAttribute('data-align')).toBe('center');
  });

  it('renders back button when callback provided + invokes on click', () => {
    const handleBack = vi.fn();
    render(<PageHeader title="x" back={handleBack} />);
    const btn = screen.getByRole('button', { name: '返回' });
    fireEvent.click(btn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('omits back button when no callback', () => {
    render(<PageHeader title="x" />);
    expect(screen.queryByRole('button', { name: '返回' })).toBeNull();
  });

  it('uses custom backLabel for accessibility', () => {
    render(<PageHeader title="x" back={() => {}} backLabel="回行程列表" />);
    expect(screen.getByRole('button', { name: '回行程列表' })).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(<PageHeader title="x" actions={<button>登出全部</button>} />);
    expect(screen.getByRole('button', { name: '登出全部' })).toBeInTheDocument();
  });
});
