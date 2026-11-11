'use client';

import { createContext, useContext } from 'react';

export type ToolbarOrientation = 'horizontal' | 'vertical';

export type ToolbarContextValue = {
  orientation: ToolbarOrientation;
  disabled: boolean;
};

export const ToolbarContext = createContext<ToolbarContextValue | null>(null);

// Items carry this attribute and the Root finds them in the DOM, so
// Ark parts (Toggle, ToggleGroup items) can join without a registry.
export const TOOLBAR_ITEM_ATTR = 'data-toolbar-item';

export const toolbarItemProps = { [TOOLBAR_ITEM_ATTR]: '' } as const;

// null outside a Toolbar, so a part can opt in only when it is inside one.
export const useToolbarContext = (): ToolbarContextValue | null =>
  useContext(ToolbarContext);

type ItemOptions = {
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
};

export const useToolbarItem = ({
  disabled,
  focusableWhenDisabled = true,
}: ItemOptions = {}) => {
  const toolbar = useToolbarContext();
  const isDisabled = disabled === true || toolbar?.disabled === true;
  const keepsFocus = toolbar !== null && focusableWhenDisabled;
  return {
    inToolbar: toolbar !== null,
    isDisabled,
    // aria-disabled keeps the item in the arrow-key order; native disabled drops it.
    nativeDisabled: isDisabled && !keepsFocus,
    ariaDisabled: isDisabled && keepsFocus ? true : undefined,
    attrs: toolbar === null ? {} : toolbarItemProps,
  };
};
