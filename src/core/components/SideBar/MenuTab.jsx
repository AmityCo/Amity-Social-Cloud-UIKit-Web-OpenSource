import React from 'react';
import customizableComponent from '~/core/hocs/customization';
import { MenuTabContainer, MenuName } from './styles';

const MenuTab = ({ icon, name, className, onClick, active }) => {
  return (
    <MenuTabContainer className={className} active={active} onClick={onClick}>
      {icon}
      <MenuName>{name}</MenuName>
    </MenuTabContainer>
  );
};

export default customizableComponent('MenuTab', MenuTab);
