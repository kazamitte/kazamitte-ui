'use client';

import {
  useEffect,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { ark } from '@ark-ui/react';
import { tv } from '../../tv';

const liveRegionStyles = tv({ base: 'sr-only' });

export type Politeness = 'polite' | 'assertive';

type LiveRegionProps = Omit<ComponentPropsWithRef<typeof ark.div>, 'role'> & {
  politeness?: Politeness;
};

// Screen readers announce changes to a live region, not text that was
// already there when it was inserted. So the first commit is always empty
// and the children follow on the next tick.
export const LiveRegion = ({
  politeness = 'polite',
  className,
  children,
  ...props
}: LiveRegionProps) => {
  const [shown, setShown] = useState<ReactNode>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setShown(children), 0);
    return () => window.clearTimeout(timer);
  }, [children]);

  return (
    <ark.div
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic="true"
      className={liveRegionStyles({ className })}
      {...props}
    >
      {shown}
    </ark.div>
  );
};
