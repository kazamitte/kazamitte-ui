'use client';

import { useMemo, type ReactNode } from 'react';
import { Listbox as ArkListbox, createListCollection } from '@ark-ui/react';
import { Check } from 'lucide-react';
import { GroupedItems } from '../../GroupedItems';
import { tv } from '../../tv';
import {
  fieldSlots,
  focusRing,
  listItemAccessors,
  menuListStyles,
  splitGroupedItems,
  type ListItem,
} from '../../variants';

const listboxStyles = tv({
  slots: {
    root: [fieldSlots.root, 'ark-disabled:opacity-50'],
    label: fieldSlots.label,
    content: [
      'max-h-72 overflow-y-auto rounded-overlay border base-border-muted base-bg p-1',
      'ark-horizontal:flex ark-horizontal:max-h-none ark-horizontal:overflow-x-auto',
      focusRing(),
    ],
  },
});

const styles = listboxStyles();
const list = menuListStyles();

export type ListboxItem = ListItem;

type ListboxProps = Omit<
  ArkListbox.RootProps<ListboxItem>,
  'collection' | 'children'
> & {
  items: ListboxItem[];
  label?: ReactNode;
};

const Item = ({ item }: { item: ListboxItem }) => (
  <ArkListbox.Item item={item} className={list.item()}>
    <ArkListbox.ItemText className={list.itemText()}>
      {item.label}
    </ArkListbox.ItemText>
    <ArkListbox.ItemIndicator className={list.itemIndicator()}>
      <Check aria-hidden="true" />
    </ArkListbox.ItemIndicator>
  </ArkListbox.Item>
);

export const Listbox = ({
  items,
  label,
  className,
  ...props
}: ListboxProps) => {
  const collection = useMemo(
    () =>
      createListCollection<ListboxItem>({
        items,
        ...listItemAccessors,
      }),
    [items],
  );
  const grouped = useMemo(
    () => items.some((item) => item.group !== undefined),
    [items],
  );

  return (
    <ArkListbox.Root
      collection={collection}
      className={styles.root({ className })}
      {...props}
    >
      {label !== undefined && (
        <ArkListbox.Label className={styles.label()}>{label}</ArkListbox.Label>
      )}
      <ArkListbox.Content className={styles.content()}>
        {grouped ? (
          <GroupedItems
            groups={splitGroupedItems(collection.group())}
            Group={ArkListbox.ItemGroup}
            GroupLabel={ArkListbox.ItemGroupLabel}
            renderItem={(item) => <Item key={item.value} item={item} />}
          />
        ) : (
          items.map((item) => <Item key={item.value} item={item} />)
        )}
      </ArkListbox.Content>
    </ArkListbox.Root>
  );
};
