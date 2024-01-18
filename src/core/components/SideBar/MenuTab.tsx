import React from 'react';
import { MenuTabContainer, MenuName } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface MenuTabProps {
  icon: React.ReactNode;
  name: string;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

const MenuTab = ({ icon, name, className, onClick, active }: MenuTabProps) => {
  return (
    <MenuTabContainer className={className} active={active} onClick={onClick}>
      {icon}
      <MenuName>{name}</MenuName>
    </MenuTabContainer>
  );
};

export default (props: MenuTabProps) => {
  const CustomComponentFn = useCustomComponent<MenuTabProps>('MenuTab');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <MenuTab {...props} />;
};
