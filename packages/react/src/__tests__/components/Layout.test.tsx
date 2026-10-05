import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from '../../components/Grid';
import { Inline } from '../../components/Inline';
import { Stack } from '../../components/Stack';

describe('Stack', () => {
  it('lays out the child element itself with asChild', () => {
    const { container } = render(
      <Stack asChild direction="row">
        <ul>
          <li>a</li>
          <li>b</li>
        </ul>
      </Stack>,
    );
    expect(container.firstElementChild).toBe(screen.getByRole('list'));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

describe('Inline', () => {
  it('lays out the child element itself with asChild', () => {
    const { container } = render(
      <Inline asChild>
        <nav aria-label="タグ">
          <a href="#a">a</a>
        </nav>
      </Inline>,
    );
    expect(container.firstElementChild).toBe(
      screen.getByRole('navigation', { name: 'タグ' }),
    );
  });
});

describe('Grid', () => {
  it('lays out the child element itself with asChild', () => {
    const { container } = render(
      <Grid asChild columns={3}>
        <section aria-label="商品">
          <article>a</article>
        </section>
      </Grid>,
    );
    expect(container.firstElementChild).toBe(
      screen.getByRole('region', { name: '商品' }),
    );
  });
});
