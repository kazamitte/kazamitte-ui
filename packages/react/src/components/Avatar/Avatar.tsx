'use client';

import { Avatar as ArkAvatar } from '@ark-ui/react';
import { tv, type VariantProps } from '../../tv';

const avatarStyles = tv({
  slots: {
    root: 'inline-flex shrink-0 overflow-hidden rounded-pill base-bg-muted align-middle',
    image: 'size-full object-cover',
    fallback:
      'flex size-full items-center justify-center font-medium base-fg uppercase select-none',
  },
  variants: {
    size: {
      xs: { root: 'size-6', fallback: 'text-oneline-14' },
      sm: { root: 'size-8', fallback: 'text-oneline-14' },
      md: { root: 'size-10', fallback: 'text-oneline-16' },
      lg: { root: 'size-12', fallback: 'text-oneline-18' },
      xl: { root: 'size-16', fallback: 'text-highlight-22' },
    },
    shape: {
      circle: { root: 'rounded-pill' },
      square: { root: 'rounded-control' },
    },
  },
  defaultVariants: { size: 'md', shape: 'circle' },
});

export const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? '')
    .join('');

type AvatarProps = ArkAvatar.RootProps &
  VariantProps<typeof avatarStyles> & {
    name: string;
    src?: string;
  };

export const Avatar = ({
  name,
  src,
  size,
  shape,
  className,
  ...props
}: AvatarProps) => {
  const styles = avatarStyles({ size, shape });
  return (
    <ArkAvatar.Root className={styles.root({ className })} {...props}>
      <ArkAvatar.Fallback className={styles.fallback()} aria-label={name}>
        {initialsOf(name)}
      </ArkAvatar.Fallback>
      {src !== undefined && (
        <ArkAvatar.Image src={src} alt={name} className={styles.image()} />
      )}
    </ArkAvatar.Root>
  );
};
