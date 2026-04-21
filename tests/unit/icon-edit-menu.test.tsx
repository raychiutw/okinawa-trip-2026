import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Icon from '../../src/components/shared/Icon';

describe('Icon — edit & menu entries', () => {
  it('renders an SVG for name="edit"', () => {
    const { container } = render(<Icon name="edit" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders an SVG for name="menu"', () => {
    const { container } = render(<Icon name="menu" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('edit svg has path data (non-empty innerHTML)', () => {
    const { container } = render(<Icon name="edit" />);
    const svg = container.querySelector('svg');
    expect(svg?.innerHTML.length).toBeGreaterThan(0);
  });

  it('menu svg has path data (non-empty innerHTML)', () => {
    const { container } = render(<Icon name="menu" />);
    const svg = container.querySelector('svg');
    expect(svg?.innerHTML.length).toBeGreaterThan(0);
  });
});
