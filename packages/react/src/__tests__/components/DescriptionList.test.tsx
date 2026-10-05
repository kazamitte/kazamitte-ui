import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DescriptionList } from '../../components/DescriptionList';

const renderList = (
  props: React.ComponentProps<typeof DescriptionList.Root> = {},
) =>
  render(
    <DescriptionList.Root {...props}>
      <DescriptionList.Term>名前</DescriptionList.Term>
      <DescriptionList.Description>Button</DescriptionList.Description>
      <DescriptionList.Term>実装</DescriptionList.Term>
      <DescriptionList.Description>native</DescriptionList.Description>
    </DescriptionList.Root>,
  );

describe('DescriptionList', () => {
  it('renders terms and definitions as a description list', () => {
    renderList();
    expect(screen.getAllByRole('term')).toHaveLength(2);
    expect(screen.getAllByRole('definition')).toHaveLength(2);
    expect(screen.getByText('Button').tagName).toBe('DD');
    expect(screen.getByText('名前').closest('dl')).not.toBeNull();
  });
});
