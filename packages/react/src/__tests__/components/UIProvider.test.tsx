import { useLocaleContext } from '@ark-ui/react/locale';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UIProvider } from '../../components/UIProvider';

const LocaleProbe = () => {
  const { locale, dir } = useLocaleContext();
  return <p>{`${locale} ${dir}`}</p>;
};

describe('UIProvider', () => {
  it('hands its locale to the Ark components inside', () => {
    render(
      <UIProvider locale="ja-JP">
        <LocaleProbe />
      </UIProvider>,
    );
    expect(screen.getByText('ja-JP ltr')).toBeInTheDocument();
  });

  it('derives the text direction from the locale', () => {
    render(
      <UIProvider locale="ar-EG">
        <LocaleProbe />
      </UIProvider>,
    );
    expect(screen.getByText('ar-EG rtl')).toBeInTheDocument();
  });
});
