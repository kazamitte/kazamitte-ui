'use client';

import type { ComponentProps } from 'react';
import { Menu as ArkMenu, Portal } from '@ark-ui/react';
import { Check, ChevronRight } from 'lucide-react';
import { tv } from '../../tv';
import { menuListStyles } from '../../variants';

const list = menuListStyles();

const menuStyles = tv({
  slots: {
    triggerItem: 'justify-between',
    triggerItemIndicator: 'inline-flex base-fg-muted [&>svg]:size-4',
  },
});

const styles = menuStyles();

const defaultPositioning: ArkMenu.RootProps['positioning'] = {
  placement: 'bottom-start',
  gutter: 4,
};

export const MenuRoot = ({ positioning, ...props }: ArkMenu.RootProps) => (
  <ArkMenu.Root
    positioning={{ ...defaultPositioning, ...positioning }}
    {...props}
  />
);

export const MenuTrigger = ArkMenu.Trigger;

export const MenuPortal = Portal;

export const MenuPositioner = ({
  className,
  ...props
}: ComponentProps<typeof ArkMenu.Positioner>) => (
  <ArkMenu.Positioner className={list.positioner({ className })} {...props} />
);

export const MenuContent = ({
  className,
  ...props
}: ComponentProps<typeof ArkMenu.Content>) => (
  <ArkMenu.Content className={list.content({ className })} {...props} />
);

export const MenuItem = ({
  className,
  ...props
}: ComponentProps<typeof ArkMenu.Item>) => (
  <ArkMenu.Item className={list.item({ className })} {...props} />
);

export const MenuItemText = ({
  className,
  ...props
}: ComponentProps<typeof ArkMenu.ItemText>) => (
  <ArkMenu.ItemText className={list.itemText({ className })} {...props} />
);

export const MenuItemGroup = ArkMenu.ItemGroup;

export const MenuItemGroupLabel = ({
  className,
  ...props
}: ComponentProps<typeof ArkMenu.ItemGroupLabel>) => (
  <ArkMenu.ItemGroupLabel
    className={list.itemGroupLabel({ className })}
    {...props}
  />
);

export const MenuSeparator = ({
  className,
  ...props
}: ComponentProps<typeof ArkMenu.Separator>) => (
  <ArkMenu.Separator className={list.separator({ className })} {...props} />
);

export const MenuCheckboxItem = ({
  className,
  ...props
}: ComponentProps<typeof ArkMenu.CheckboxItem>) => (
  <ArkMenu.CheckboxItem className={list.item({ className })} {...props} />
);

export const MenuRadioItemGroup = ArkMenu.RadioItemGroup;

export const MenuRadioItem = ({
  className,
  ...props
}: ComponentProps<typeof ArkMenu.RadioItem>) => (
  <ArkMenu.RadioItem className={list.item({ className })} {...props} />
);

export const MenuItemIndicator = ({
  className,
  children,
  ...props
}: ComponentProps<typeof ArkMenu.ItemIndicator>) => (
  <ArkMenu.ItemIndicator
    className={list.itemIndicator({ className })}
    {...props}
  >
    {children ?? <Check aria-hidden="true" />}
  </ArkMenu.ItemIndicator>
);

export const MenuTriggerItem = ({
  className,
  children,
  ...props
}: ComponentProps<typeof ArkMenu.TriggerItem>) => (
  <ArkMenu.TriggerItem
    className={list.item({ className: [styles.triggerItem(), className] })}
    {...props}
  >
    {children}
    <span className={styles.triggerItemIndicator()}>
      <ChevronRight aria-hidden="true" />
    </span>
  </ArkMenu.TriggerItem>
);
