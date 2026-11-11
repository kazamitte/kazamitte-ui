'use client';

import { useId, type ComponentProps } from 'react';
import { NavigationMenu as ArkNavigationMenu } from '@ark-ui/react/navigation-menu';
import { tv } from '../../tv';
import { tabsStyles } from '../Tabs/Tabs';

const tabs = tabsStyles();

// Same trigger and list as Tabs. The selected mark is drawn on the link
// itself (Tabs has an Indicator part that only tracks a tablist), and the
// ring is drawn inside so the scroll container does not clip it.
const tabNavStyles = tv({
  slots: {
    list: 'overflow-x-auto',
    link: [
      'relative shrink-0 whitespace-nowrap focus-visible:-outline-offset-2',
      'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5',
      'ark-current:after:primary-bg-solid',
    ],
  },
});

const styles = tabNavStyles();

type TabNavRootProps = Omit<
  ComponentProps<typeof ArkNavigationMenu.Root>,
  'aria-label' | 'aria-labelledby'
> &
  (
    | { 'aria-label': string; 'aria-labelledby'?: never }
    | { 'aria-labelledby': string; 'aria-label'?: never }
  );

export const TabNavRoot = ({ className, ...props }: TabNavRootProps) => (
  <ArkNavigationMenu.Root className={className} {...props} />
);

export const TabNavList = ({ className, ...props }: ComponentProps<'ul'>) => (
  <ArkNavigationMenu.List asChild>
    <ul
      className={tabs.list({ className: styles.list({ className }) })}
      {...props}
    />
  </ArkNavigationMenu.List>
);

type TabNavLinkProps = ComponentProps<typeof ArkNavigationMenu.Link>;

// Item is Ark's keyboard unit (arrow keys, Home, End between links), so Link
// brings its own and the caller only writes Root, List and Link.
export const TabNavLink = ({ className, ...props }: TabNavLinkProps) => {
  const value = useId();
  return (
    <ArkNavigationMenu.Item value={value} asChild>
      <li>
        <ArkNavigationMenu.Link
          className={tabs.trigger({ className: styles.link({ className }) })}
          {...props}
        />
      </li>
    </ArkNavigationMenu.Item>
  );
};
