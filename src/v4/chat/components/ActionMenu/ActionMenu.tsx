import { useState, type ComponentType, type SVGProps } from 'react';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { Popover } from '~/v4/core/components/AriaPopover';
import { Menu } from '~/v4/core/components/Menu';
import { IconButton, type IconName } from '~/v4/chat/elements/IconButton';

export type ActionMenuItem = {
  key: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type ActionMenuProps = {
  icon?: IconName;
  ariaLabel?: string;
  getItems: () => ActionMenuItem[] | Promise<ActionMenuItem[]>;
};

export function ActionMenu({
  getItems,
  icon = 'ellipsis-v',
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
        <IconButton
          icon={icon}
          variant="transparent"
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
