'use client';

import { Portal } from '@ark-ui/react/portal';
import { Tour as ArkTour, useTour } from '@ark-ui/react/tour';
import { X } from 'lucide-react';
import { tv } from '../../tv';
import { focusRing } from '../../variants';
import { buttonStyles } from '../Button';

const tourStyles = tv({
  slots: {
    // Ark's TourBackdrop hardcodes `hidden`, overriding the presence-driven one;
    // drop pointer-events on data-state=closed or it freezes the page.
    backdrop: [
      'fixed inset-0 z-overlay bg-(--r-base-fg-strong)/50',
      'ark-open:animate-fade-in ark-closed:pointer-events-none ark-closed:animate-fade-out',
    ],
    spotlight: 'rounded-control',
    // Ark never defines --tour-z-index for tooltip steps; undefined, z-index
    // falls to auto and the actions paint below the backdrop.
    positioner: [
      'z-modal [--tour-z-index:var(--z-index-modal)]',
      'data-[type=dialog]:fixed data-[type=dialog]:inset-0 data-[type=dialog]:flex data-[type=dialog]:items-center data-[type=dialog]:justify-center',
    ],
    content: [
      'relative flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-1 rounded-overlay base-bg p-5 base-fg shadow-overlay',
      '[--arrow-background:var(--r-base-bg)] [--arrow-size:10px]',
      'ark-open:animate-scale-in ark-closed:animate-scale-out',
    ],
    arrowTip: 'border-t border-l base-border-muted',
    progress: 'text-dense-14 base-fg-muted',
    title: 'text-body-18 font-semibold base-fg-strong',
    description: 'text-dense-14 base-fg-muted',
    control: 'mt-3 flex items-center gap-2',
    closeTrigger: [
      'absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-control base-fg-muted',
      'hover:base-bg-subtle hover:base-fg-strong',
      focusRing(),
    ],
  },
});

const styles = tourStyles();

const defaultTranslations: NonNullable<
  Parameters<typeof useTour>[0]
>['translations'] = {
  progressText: ({ current, total }) => `${current + 1} / ${total}`,
  nextStep: '次へ',
  prevStep: '戻る',
  close: '閉じる',
  skip: 'スキップ',
};

export type TourStep = ArkTour.StepDetails;

export const useAppTour = (
  props: Parameters<typeof useTour>[0],
): ReturnType<typeof useTour> =>
  useTour({
    ...props,
    translations: { ...defaultTranslations, ...props?.translations },
  });

type TourProps = {
  tour: ReturnType<typeof useTour>;
};

export const Tour = ({ tour }: TourProps) => (
  <ArkTour.Root tour={tour}>
    <Portal>
      <ArkTour.Backdrop className={styles.backdrop()} />
      <ArkTour.Spotlight className={styles.spotlight()} />
      <ArkTour.Positioner className={styles.positioner()}>
        <ArkTour.Content className={styles.content()}>
          <ArkTour.Arrow>
            <ArkTour.ArrowTip className={styles.arrowTip()} />
          </ArkTour.Arrow>
          <ArkTour.ProgressText className={styles.progress()} />
          <ArkTour.Title className={styles.title()} />
          <ArkTour.Description className={styles.description()} />
          <ArkTour.Control className={styles.control()}>
            <ArkTour.Actions>
              {(actions) =>
                actions.map((action, index) => (
                  <ArkTour.ActionTrigger
                    key={action.label}
                    action={action}
                    aria-label={action.label}
                    className={buttonStyles({
                      size: 'sm',
                      variant:
                        index === actions.length - 1 ? 'primary' : 'outline',
                    })}
                  />
                ))
              }
            </ArkTour.Actions>
          </ArkTour.Control>
          <ArkTour.CloseTrigger className={styles.closeTrigger()}>
            <X aria-hidden="true" className="size-4" />
          </ArkTour.CloseTrigger>
        </ArkTour.Content>
      </ArkTour.Positioner>
    </Portal>
  </ArkTour.Root>
);
