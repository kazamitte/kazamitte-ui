'use client';

import { useFormatHotkey, useHotkey } from '@ark-ui/react';
import { Kbd } from '../Kbd';

export { useHotkey };

type HotkeyTextProps = {
  hotkey: string;
  className?: string;
};

export const HotkeyText = ({ hotkey, className }: HotkeyTextProps) => {
  const format = useFormatHotkey();
  const steps = hotkey.split(/\s+then\s+/i);
  return (
    <span className={className}>
      {steps.map((step, stepIndex) => {
        const keys = format(step).split(/\s*\+\s*|\s+/);
        return (
          <span key={stepIndex}>
            {stepIndex > 0 && (
              <span className="mx-1 base-fg-muted">の次に</span>
            )}
            {keys.map((key, index) => (
              <span key={index}>
                {index > 0 && <span aria-hidden="true">+</span>}
                <Kbd>{key}</Kbd>
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
};
