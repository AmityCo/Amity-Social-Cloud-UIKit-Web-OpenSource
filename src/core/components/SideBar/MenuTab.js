import React from 'react';
import customizableComponent from '~/core/hocs/customization';
import { MenuTabContainer, MenuName } from './styles';

const MenuTab = ({ icon, name, className, onClick, active }) => {
  return (
    <MenuTabContainer className={className} onClick={onClick} active={active}>
      {icon}
      <MenuName>{name}</MenuName>
    </MenuTabContainer>
  );
};

export default customizableComponent('MenuTab', MenuTab);
