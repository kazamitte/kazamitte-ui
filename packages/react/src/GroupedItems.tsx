import { Fragment, type ComponentType, type ReactNode } from 'react';
import { menuListStyles, type GroupedItemsBucket } from './variants';

const list = menuListStyles();

type GroupedItemsProps<T> = {
  groups: GroupedItemsBucket<T>[];
  Group: ComponentType<{ children: ReactNode }>;
  GroupLabel: ComponentType<{ className: string; children: ReactNode }>;
  renderItem: (item: T) => ReactNode;
};

export const GroupedItems = <T,>({
  groups,
  Group,
  GroupLabel,
  renderItem,
}: GroupedItemsProps<T>) =>
  groups.map(({ key, label, items }) =>
    label !== undefined ? (
      <Group key={key}>
        <GroupLabel className={list.itemGroupLabel()}>{label}</GroupLabel>
        {items.map(renderItem)}
      </Group>
    ) : (
      <Fragment key={key}>{items.map(renderItem)}</Fragment>
    ),
  );
