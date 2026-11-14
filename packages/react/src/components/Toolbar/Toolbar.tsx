'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentPropsWithRef,
} from 'react';
import { ark } from '@ark-ui/react/factory';
import { tv } from '../../tv';
import { Button, buttonStyles } from '../Button';
import { Separator } from '../Separator';
import {
  TOOLBAR_ITEM_ATTR,
  ToolbarContext,
  useToolbarContext,
  useToolbarItem,
  type ToolbarContextValue,
  type ToolbarOrientation,
} from './context';

const ITEM_SELECTOR = `[${TOOLBAR_ITEM_ATTR}]:not(:disabled)`;

const toolbarStyles = tv({
  slots: {
    root: 'flex gap-1',
    group: 'flex gap-1',
    disabled: 'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    separator: '',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex-row items-center',
        group: 'items-center',
        separator: 'mx-1',
      },
      vertical: {
        root: 'flex-col items-stretch',
        group: 'flex-col items-stretch',
        separator: 'my-1',
      },
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

const FORWARD_KEYS: Record<ToolbarOrientation, string> = {
  horizontal: 'ArrowRight',
  vertical: 'ArrowDown',
};
const BACKWARD_KEYS: Record<ToolbarOrientation, string> = {
  horizontal: 'ArrowLeft',
  vertical: 'ArrowUp',
};

type ToolbarRootProps = ComponentPropsWithRef<typeof ark.div> & {
  orientation?: ToolbarOrientation;
  loopFocus?: boolean;
  disabled?: boolean;
};

const getItems = (root: HTMLElement | null): HTMLElement[] =>
  Array.from(root?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);

// The tab stop is written to the DOM, not rendered, so items added, removed
// or re-rendered by Ark parts never need to tell the Root.
const syncItems = (
  root: HTMLElement | null,
  lastFocused: HTMLElement | null,
) => {
  const items = getItems(root);
  const active =
    lastFocused !== null && items.includes(lastFocused)
      ? lastFocused
      : items[0];
  for (const item of items) {
    const value = item === active ? '0' : '-1';
    if (item.getAttribute('tabindex') !== value) {
      item.setAttribute('tabindex', value);
    }
  }
};

export const ToolbarRoot = ({
  orientation = 'horizontal',
  loopFocus = true,
  disabled = false,
  className,
  ref,
  onFocus,
  onKeyDown,
  ...props
}: ToolbarRootProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  // The Root needs its own ref to find the items, and the caller's ref too.
  const setRoot = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
      return undefined;
    },
    [ref],
  );

  const syncTabStop = useCallback(() => {
    syncItems(rootRef.current, lastFocused.current);
  }, []);

  useLayoutEffect(syncTabStop);

  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return undefined;
    const observer = new MutationObserver(syncTabStop);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', TOOLBAR_ITEM_ATTR],
    });
    return () => observer.disconnect();
  }, [syncTabStop]);

  const context = useMemo<ToolbarContextValue>(
    () => ({ orientation, disabled }),
    [orientation, disabled],
  );

  return (
    <ToolbarContext value={context}>
      <ark.div
        ref={setRoot}
        role="toolbar"
        aria-orientation={orientation}
        className={toolbarStyles({ orientation }).root({ className })}
        onFocus={(event) => {
          onFocus?.(event);
          const target = event.target as HTMLElement;
          if (
            rootRef.current?.contains(target) === true &&
            target.matches(ITEM_SELECTOR)
          ) {
            lastFocused.current = target;
            syncTabStop();
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          const target = event.target as HTMLElement;
          // Portalled content (a Menu list) bubbles through React, not the DOM.
          // Ark's ToggleGroup preventDefaults arrow keys even with rovingFocus
          // off, so it is the one part whose handled keys still count here.
          const handledByPart =
            event.defaultPrevented &&
            target.closest('[data-scope="toggle-group"]') === null;
          if (
            handledByPart ||
            rootRef.current?.contains(target) !== true ||
            !target.matches(ITEM_SELECTOR)
          ) {
            return;
          }
          const items = getItems(rootRef.current);
          const index = items.indexOf(target);
          let next: number | undefined;
          if (event.key === FORWARD_KEYS[orientation]) {
            next = index + 1 < items.length ? index + 1 : loopFocus ? 0 : index;
          } else if (event.key === BACKWARD_KEYS[orientation]) {
            next = index > 0 ? index - 1 : loopFocus ? items.length - 1 : index;
          } else if (event.key === 'Home') {
            next = 0;
          } else if (event.key === 'End') {
            next = items.length - 1;
          }
          if (next === undefined) return;
          event.preventDefault();
          items[next]?.focus();
        }}
        {...props}
      />
    </ToolbarContext>
  );
};

type ToolbarButtonProps = Omit<
  ComponentPropsWithRef<typeof Button>,
  'loading' | 'loadingText'
> & {
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
};

// A disabled item keeps focus, so anything wrapped around it (a Menu or
// Popover trigger) would still see the press. The capture handlers stop it
// before the trigger's own handlers run. Arrow keys the Root uses to move
// stay free: only the key that would open a Menu is held back.
const swallowPress = (orientation: ToolbarOrientation) => ({
  onPointerDownCapture: (event: React.PointerEvent) => {
    event.stopPropagation();
  },
  onClickCapture: (event: React.MouseEvent) => {
    event.stopPropagation();
  },
  onKeyDownCapture: (event: React.KeyboardEvent) => {
    const opensMenu =
      event.key === 'Enter' ||
      event.key === ' ' ||
      (orientation === 'horizontal' &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp'));
    if (opensMenu) {
      event.preventDefault();
      event.stopPropagation();
    }
  },
});

export const ToolbarButton = ({
  variant = 'ghost',
  size = 'sm',
  disabled,
  focusableWhenDisabled,
  className,
  onClick,
  ...props
}: ToolbarButtonProps) => {
  const item = useToolbarItem({ disabled, focusableWhenDisabled });
  const toolbar = useToolbarContext();
  return (
    <Button
      variant={variant}
      size={size}
      disabled={item.nativeDisabled || undefined}
      aria-disabled={item.ariaDisabled}
      className={toolbarStyles().disabled({ className })}
      onClick={(event) => {
        if (item.isDisabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...item.attrs}
      {...props}
      {...(item.ariaDisabled === true &&
        swallowPress(toolbar?.orientation ?? 'horizontal'))}
    />
  );
};

type ToolbarLinkProps = ComponentPropsWithRef<typeof ark.a>;

export const ToolbarLink = ({
  className,
  onClick,
  ...props
}: ToolbarLinkProps) => {
  const item = useToolbarItem();
  return (
    <ark.a
      className={buttonStyles({
        variant: 'link',
        className: toolbarStyles().disabled({ className }),
      })}
      aria-disabled={item.ariaDisabled}
      onClick={(event) => {
        if (item.isDisabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...item.attrs}
      {...props}
    />
  );
};

type ToolbarGroupProps = ComponentPropsWithRef<typeof ark.div> & {
  'aria-label': string;
  disabled?: boolean;
};

export const ToolbarGroup = ({
  disabled = false,
  className,
  ...props
}: ToolbarGroupProps) => {
  const toolbar = useToolbarContext();
  const value = useMemo<ToolbarContextValue>(
    () => ({
      orientation: toolbar?.orientation ?? 'horizontal',
      disabled: disabled || toolbar?.disabled === true,
    }),
    [toolbar?.orientation, toolbar?.disabled, disabled],
  );
  return (
    <ToolbarContext value={value}>
      <ark.div
        role="group"
        className={toolbarStyles({ orientation: value.orientation }).group({
          className,
        })}
        {...props}
      />
    </ToolbarContext>
  );
};

export const ToolbarSeparator = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof Separator>) => {
  const toolbar = useToolbarContext();
  const toolbarOrientation = toolbar?.orientation ?? 'horizontal';
  return (
    <Separator
      orientation={
        toolbarOrientation === 'vertical' ? 'horizontal' : 'vertical'
      }
      className={toolbarStyles({ orientation: toolbarOrientation }).separator({
        className,
      })}
      {...props}
    />
  );
};
