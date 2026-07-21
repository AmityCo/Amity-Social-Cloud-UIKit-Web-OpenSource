import { useState, type ComponentType, type ReactNode, type SVGProps } from 'react';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { Popover } from '~/v4/core/design/components/Popover';
import { Menu } from '~/v4/core/design/components/Menu';
import { Button } from '~/v4/core/design/atoms/Button';
import { EllipsisV } from '~/v4/core/design/icons/EllipsisV';

export type ActionMenuItem = {
  key: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type ActionMenuProps = {
  icon?: ReactNode;
  ariaLabel?: string;
  getItems: () => ActionMenuItem[] | Promise<ActionMenuItem[]>;
};

export function ActionMenu({
  getItems,
  icon = <EllipsisV />,
  ariaLabel = 'Actions',
}: ActionMenuProps) {
  const { setDrawerData, removeDrawerData } = useDrawer();
  const [items, setItems] = useState<ActionMenuItem[]>([]);

  const renderItems = (list: ActionMenuItem[], dismiss: () => void) =>
    list.map((item) => (
      <Menu.Item
        key={item.key}
        icon={item.icon}
        label={item.label}
        destructive={item.destructive}
        onPress={() => {
          dismiss();
          item.onPress();
        }}
      />
    ));

  return (
    <Popover
      trigger={({ isDesktop, openPopover }) => (
        <Button.Icon
          icon={icon}
          styleType="ghost"
          hierarchy="secondary"
          size={32}
          aria-label={ariaLabel}
          onPress={async () => {
            const list = await getItems();
            if (list.length === 0) return;
            if (isDesktop) {
              setItems(list);
              openPopover();
            } else {
              setDrawerData({
                ariaLabel,
                content: <Menu container="drawer">{renderItems(list, removeDrawerData)}</Menu>,
              });
            }
          }}
        />
      )}
    >
      {({ closePopover }) => <Menu container="popover">{renderItems(items, closePopover)}</Menu>}
    </Popover>
  );
}
