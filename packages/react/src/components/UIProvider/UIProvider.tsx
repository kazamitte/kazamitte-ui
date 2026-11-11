'use client';

import type { ReactNode } from 'react';
import { LocaleProvider } from '@ark-ui/react/locale';
import { AnnouncerProvider } from '../LiveRegion/announce';

export type UIProviderProps = {
  locale: string;
  children: ReactNode;
};

export const UIProvider = ({ locale, children }: UIProviderProps) => (
  <LocaleProvider locale={locale}>
    <AnnouncerProvider>{children}</AnnouncerProvider>
  </LocaleProvider>
);
