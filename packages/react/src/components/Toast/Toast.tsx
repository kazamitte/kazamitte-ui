'use client';

import {
  Toast as ArkToast,
  Toaster as ArkToaster,
  createToaster,
  type CreateToasterReturn,
} from '@ark-ui/react';
import {
  CircleAlert,
  CircleCheck,
  OctagonAlert,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react';
import { tv, type VariantProps } from '../../tv';
import { focusRing } from '../../variants';
import { Spinner } from '../Spinner';

export { createToaster };

const toastStyles = tv({
  slots: {
    root: [
      'relative flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-overlay border base-border-muted base-bg p-4 base-fg shadow-overlay',
      'z-(--z-index) h-(--height) translate-[var(--x)_var(--y)] scale-(--scale) opacity-(--opacity)',
      'transition-[translate,scale,opacity] duration-transition ease-standard will-change-[translate,opacity,scale]',
    ],
    indicator: 'mt-0.5 inline-flex shrink-0 [&>svg]:size-5',
    content: 'flex min-w-0 flex-1 flex-col gap-1',
    title: 'text-body-16 font-bold base-fg-strong',
    description: 'text-dense-14 base-fg-muted',
    actionTrigger: [
      'mt-1 self-start rounded-control text-dense-14 font-medium link-fg underline underline-offset-2 hover:link-fg-strong',
      focusRing(),
    ],
    closeTrigger: [
      'inline-flex size-7 shrink-0 items-center justify-center rounded-control base-fg-muted',
      'hover:base-bg-subtle hover:base-fg-strong',
      focusRing(),
    ],
  },
  variants: {
    type: {
      info: { indicator: 'info-fg' },
      success: { indicator: 'success-fg' },
      warning: { indicator: 'warning-fg' },
      error: { indicator: 'error-fg' },
      loading: { indicator: 'primary-fg' },
    },
  },
});

type ToastType = NonNullable<VariantProps<typeof toastStyles>['type']>;

const icons: Record<Exclude<ToastType, 'loading'>, LucideIcon> = {
  info: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
  error: OctagonAlert,
};

const isToastType = (value: unknown): value is ToastType =>
  typeof value === 'string' && value in toastStyles.variants.type;

const Indicator = ({ type }: { type: ToastType }) => {
  if (type === 'loading') return <Spinner size="sm" decorative />;
  const Icon = icons[type];
  return <Icon aria-hidden="true" />;
};

type ToasterProps = {
  toaster: CreateToasterReturn;
};

export const Toaster = ({ toaster }: ToasterProps) => (
  <ArkToaster toaster={toaster}>
    {(toast) => {
      const type = isToastType(toast.type) ? toast.type : undefined;
      const styles = toastStyles({ type });
      return (
        <ArkToast.Root key={toast.id} className={styles.root()}>
          {type !== undefined && (
            <span className={styles.indicator()}>
              <Indicator type={type} />
            </span>
          )}
          <div className={styles.content()}>
            <ArkToast.Title className={styles.title()}>
              {toast.title}
            </ArkToast.Title>
            {toast.description !== undefined && (
              <ArkToast.Description className={styles.description()}>
                {toast.description}
              </ArkToast.Description>
            )}
            {toast.action !== undefined && (
              <ArkToast.ActionTrigger className={styles.actionTrigger()}>
                {toast.action.label}
              </ArkToast.ActionTrigger>
            )}
          </div>
          <ArkToast.CloseTrigger
            aria-label="閉じる"
            className={styles.closeTrigger()}
          >
            <X aria-hidden="true" className="size-4" />
          </ArkToast.CloseTrigger>
        </ArkToast.Root>
      );
    }}
  </ArkToaster>
);
