'use client';

import {
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
} from 'react';
import { tv, type VariantProps } from '../../tv';

const blockquoteStyles = tv({
  slots: {
    root: 'border-s-3 base-border-selected ps-4 text-body-16 base-fg',
    content: '',
    caption: 'mt-2 text-dense-14 base-fg-muted',
  },
  variants: {
    variant: {
      plain: {},
      subtle: {
        root: 'rounded-e-surface base-bg-subtle py-3 pe-4',
        caption: 'base-fg',
      },
    },
  },
  defaultVariants: { variant: 'plain' },
});

type BlockquoteVariant = VariantProps<typeof blockquoteStyles>['variant'];

// fg-muted only holds contrast on bg, so the caption needs to know when
// the quote sits on a tinted surface.
const BlockquoteVariantContext = createContext<BlockquoteVariant>(undefined);

type BlockquoteRootProps = ComponentPropsWithoutRef<'blockquote'> &
  VariantProps<typeof blockquoteStyles>;

export const BlockquoteRoot = ({
  variant,
  className,
  ...props
}: BlockquoteRootProps) => (
  <BlockquoteVariantContext.Provider value={variant}>
    <blockquote
      className={blockquoteStyles({ variant }).root({ className })}
      {...props}
    />
  </BlockquoteVariantContext.Provider>
);

export const BlockquoteContent = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div className={blockquoteStyles().content({ className })} {...props} />
);

export const BlockquoteCaption = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'footer'>) => {
  const variant = useContext(BlockquoteVariantContext);
  return (
    <footer
      className={blockquoteStyles({ variant }).caption({ className })}
      {...props}
    />
  );
};
