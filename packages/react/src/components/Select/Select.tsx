'use client';

import { useMemo, type ReactNode, type Ref, type RefAttributes } from 'react';
import { createListCollection } from '@ark-ui/react/collection';
import { Portal } from '@ark-ui/react/portal';
import { Select as ArkSelect } from '@ark-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
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
import { inputStyles } from '../Input';

const selectStyles = tv({
  slots: {
    root: fieldSlots.root,
    label: fieldSlots.label,
    control: 'relative',
    trigger: [
      inputStyles(),
      'flex cursor-default items-center justify-between gap-2 text-start',
      'ark-placeholder-shown:base-fg-muted',
      'ark-invalid:error-border-solid',
      'ark-disabled:pointer-events-none ark-disabled:opacity-50',
      focusRing(),
    ],
    indicator: [
      'inline-flex shrink-0 base-fg-muted transition-transform duration-transition ease-standard [&>svg]:size-4',
      'ark-open:rotate-180',
    ],
  },
});

const styles = selectStyles();
const list = menuListStyles();

export type SelectItem = ListItem;

const defaultPositioning: ArkSelect.RootProps<SelectItem>['positioning'] = {
  sameWidth: true,
  gutter: 4,
};

type SelectProps = Omit<
  ArkSelect.RootProps<SelectItem>,
  'collection' | 'children'
> &
  RefAttributes<HTMLDivElement> & {
    items: SelectItem[];
    label?: ReactNode;
    placeholder?: string;
    portalled?: boolean;
    triggerRef?: Ref<HTMLButtonElement>;
  };

const Item = ({ item }: { item: SelectItem }) => (
  <ArkSelect.Item item={item} className={list.item()}>
    <ArkSelect.ItemText className={list.itemText()}>
      {item.label}
    </ArkSelect.ItemText>
    <ArkSelect.ItemIndicator className={list.itemIndicator()}>
      <Check aria-hidden="true" />
    </ArkSelect.ItemIndicator>
  </ArkSelect.Item>
);

export const Select = ({
  items,
  label,
  placeholder = '選択してください',
  portalled = true,
  triggerRef,
  className,
  positioning,
  ...props
}: SelectProps) => {
  const collection = useMemo(
    () =>
      createListCollection<SelectItem>({
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
    <ArkSelect.Root
      collection={collection}
      positioning={{ ...defaultPositioning, ...positioning }}
      className={styles.root({ className })}
      {...props}
    >
      {label !== undefined && (
        <ArkSelect.Label className={styles.label()}>{label}</ArkSelect.Label>
      )}
      <ArkSelect.Control className={styles.control()}>
        <ArkSelect.Trigger ref={triggerRef} className={styles.trigger()}>
          <ArkSelect.ValueText placeholder={placeholder} />
          <ArkSelect.Indicator className={styles.indicator()}>
            <ChevronDown aria-hidden="true" />
          </ArkSelect.Indicator>
        </ArkSelect.Trigger>
      </ArkSelect.Control>
      <Portal disabled={!portalled}>
        <ArkSelect.Positioner className={list.positioner()}>
          <ArkSelect.Content className={list.content({ className: 'w-full' })}>
            {grouped ? (
              <GroupedItems
                groups={splitGroupedItems(collection.group())}
                Group={ArkSelect.ItemGroup}
                GroupLabel={ArkSelect.ItemGroupLabel}
                renderItem={(item) => <Item key={item.value} item={item} />}
              />
            ) : (
              items.map((item) => <Item key={item.value} item={item} />)
            )}
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
      <ArkSelect.HiddenSelect />
    </ArkSelect.Root>
  );
};
