import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Blockquote } from '../../components/Blockquote';
import { Code } from '../../components/Code';
import { Link } from '../../components/Link';
import { Prose } from '../../components/Prose';
import { Table } from '../../components/Table';

const style = (el: Element, ...props: string[]): string[] => {
  const computed = getComputedStyle(el);
  return props.map((prop) => computed.getPropertyValue(prop));
};

describe('Prose', () => {
  it('draws raw elements like the matching components', () => {
    render(
      <>
        <Prose>
          <a href="#a">raw link</a>
          <blockquote data-testid="raw-quote">raw quote</blockquote>
          <p>
            <code data-testid="raw-code">raw</code>
          </p>
          <table>
            <thead>
              <tr>
                <th>raw head</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>raw cell</td>
              </tr>
            </tbody>
          </table>
        </Prose>
        <Link href="#b">kit link</Link>
        <Blockquote.Root data-testid="kit-quote">
          <Blockquote.Content>kit quote</Blockquote.Content>
        </Blockquote.Root>
        <Code data-testid="kit-code">kit</Code>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>kit head</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>kit cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </>,
    );
    const same = (raw: Element, kit: Element, ...props: string[]) =>
      expect(style(raw, ...props)).toEqual(style(kit, ...props));

    same(
      screen.getByRole('link', { name: 'raw link' }),
      screen.getByRole('link', { name: 'kit link' }),
      'color',
      'text-decoration-line',
    );
    same(
      screen.getByTestId('raw-quote'),
      screen.getByTestId('kit-quote'),
      'border-inline-start-width',
      'border-inline-start-color',
      'padding-inline-start',
    );
    same(
      screen.getByTestId('raw-code'),
      screen.getByTestId('kit-code'),
      'background-color',
      'color',
      'padding-left',
      'border-top-left-radius',
    );
    same(
      screen.getByRole('columnheader', { name: 'raw head' }),
      screen.getByRole('columnheader', { name: 'kit head' }),
      'padding-top',
      'padding-left',
      'font-weight',
      'border-bottom-color',
      'border-bottom-width',
    );
    same(
      screen.getByRole('cell', { name: 'raw cell' }),
      screen.getByRole('cell', { name: 'kit cell' }),
      'padding-top',
      'border-bottom-color',
      'border-bottom-width',
    );
  });

  it('keeps a block of code scrollable and a task-list checkbox aligned', () => {
    render(
      <Prose>
        <pre data-testid="pre">{'x'.repeat(400)}</pre>
        <ul>
          <li data-testid="task">
            <input type="checkbox" disabled /> 済み
          </li>
        </ul>
      </Prose>,
    );
    expect(getComputedStyle(screen.getByTestId('pre')).overflowX).toBe('auto');
    expect(getComputedStyle(screen.getByTestId('task')).listStyleType).toBe(
      'none',
    );
  });
});
