import React from 'react';
import { customizableComponent } from 'hocs/customization';
import { MenuTabContainer, MenuName } from './styles';

const MenuTab = ({ icon, name, className, onClick, active }) => {
  return (
    <MenuTabContainer className={className} onClick={onClick} active={active}>
      <img src={icon} alt="" />
      <MenuName>{name}</MenuName>
    </MenuTabContainer>
  );
};

export default customizableComponent('MenuTab', MenuTab);
