'use client';

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { LiveRegion, type Politeness } from './LiveRegion';

type AnnounceOptions = { politeness?: Politeness };
type Announce = (message: string, options?: AnnounceOptions) => void;

// Long enough for the emptied region to reach the accessibility tree before
// the message goes in; otherwise the same text twice reads as no change.
const REFILL_DELAY_MS = 50;

const AnnounceContext = createContext<Announce | undefined>(undefined);

export const AnnouncerProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Record<Politeness, string>>({
    polite: '',
    assertive: '',
  });
  const timers = useRef<Partial<Record<Politeness, number>>>({});

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of Object.values(pending)) window.clearTimeout(timer);
    };
  }, []);

  const announce = useCallback<Announce>((message, options) => {
    const politeness = options?.politeness ?? 'polite';
    window.clearTimeout(timers.current[politeness]);
    setMessages((prev) => ({ ...prev, [politeness]: '' }));
    timers.current[politeness] = window.setTimeout(() => {
      setMessages((prev) => ({ ...prev, [politeness]: message }));
    }, REFILL_DELAY_MS);
  }, []);

  return (
    <AnnounceContext value={announce}>
      {children}
      <LiveRegion politeness="polite">{messages.polite}</LiveRegion>
      <LiveRegion politeness="assertive">{messages.assertive}</LiveRegion>
    </AnnounceContext>
  );
};

const fallbackRegions: Partial<Record<Politeness, HTMLElement>> = {};
const fallbackTimers: Partial<Record<Politeness, number>> = {};

// Outside UIProvider there is no mounted region, so make one in <body> the
// first time it is needed.
const getFallbackRegion = (politeness: Politeness): HTMLElement => {
  const existing = fallbackRegions[politeness];
  if (existing?.isConnected === true) return existing;
  const region = document.createElement('div');
  region.className = 'sr-only';
  region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('aria-atomic', 'true');
  document.body.append(region);
  fallbackRegions[politeness] = region;
  return region;
};

const announceFallback: Announce = (message, options) => {
  const politeness = options?.politeness ?? 'polite';
  const region = getFallbackRegion(politeness);
  window.clearTimeout(fallbackTimers[politeness]);
  region.textContent = '';
  fallbackTimers[politeness] = window.setTimeout(() => {
    region.textContent = message;
  }, REFILL_DELAY_MS);
};

export const useAnnounce = (): Announce => {
  const announce = use(AnnounceContext);
  return useMemo(() => announce ?? announceFallback, [announce]);
};
