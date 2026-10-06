'use client';

import { Timer as ArkTimer } from '@ark-ui/react/timer';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { tv } from '../../tv';
import { buttonStyles } from '../Button';

const timerStyles = tv({
  slots: {
    root: 'inline-flex flex-col items-start gap-3',
    area: 'flex items-center gap-1',
    item: 'min-w-[2ch] text-center font-mono text-highlight-28 font-bold base-fg-strong tabular-nums',
    separator: 'text-highlight-28 font-bold base-fg-muted',
    control: 'flex flex-wrap items-center gap-2',
  },
});

const styles = timerStyles();

type TimerProps = Omit<ArkTimer.RootProps, 'children'> & {
  showDays?: boolean;
  controls?: boolean;
};

const UNIT_LABELS = {
  days: '日',
  hours: '時間',
  minutes: '分',
  seconds: '秒',
} as const;

const defaultTranslations: ArkTimer.RootProps['translations'] = {
  areaLabel: (time) =>
    (Object.keys(UNIT_LABELS) as (keyof typeof UNIT_LABELS)[])
      .filter((unit) => unit !== 'days' || time.days > 0)
      .map((unit) => `${time[unit]}${UNIT_LABELS[unit]}`)
      .join(''),
};

const button = buttonStyles({ variant: 'outline', size: 'sm' });

const ACTIONS = [
  { action: 'start', Icon: Play, label: '開始' },
  { action: 'pause', Icon: Pause, label: '一時停止' },
  { action: 'resume', Icon: Play, label: '再開' },
  { action: 'reset', Icon: RotateCcw, label: 'リセット' },
] as const;

export const Timer = ({
  showDays = false,
  controls = true,
  translations,
  className,
  ...props
}: TimerProps) => (
  <ArkTimer.Root
    translations={{ ...defaultTranslations, ...translations }}
    className={styles.root({ className })}
    {...props}
  >
    <ArkTimer.Area className={styles.area()}>
      {showDays && (
        <>
          <ArkTimer.Item type="days" className={styles.item()} />
          <ArkTimer.Separator className={styles.separator()}>
            :
          </ArkTimer.Separator>
        </>
      )}
      <ArkTimer.Item type="hours" className={styles.item()} />
      <ArkTimer.Separator className={styles.separator()}>:</ArkTimer.Separator>
      <ArkTimer.Item type="minutes" className={styles.item()} />
      <ArkTimer.Separator className={styles.separator()}>:</ArkTimer.Separator>
      <ArkTimer.Item type="seconds" className={styles.item()} />
    </ArkTimer.Area>
    {controls && (
      <ArkTimer.Control className={styles.control()}>
        {ACTIONS.map(({ action, Icon, label }) => (
          <ArkTimer.ActionTrigger
            key={action}
            action={action}
            className={button}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </ArkTimer.ActionTrigger>
        ))}
      </ArkTimer.Control>
    )}
  </ArkTimer.Root>
);
