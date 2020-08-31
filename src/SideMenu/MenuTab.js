import React from "react";
import { customizableComponent } from "../hoks/customization";
import { MenuTabContainer, MenuName } from "./styles";

const MenuTab = ({ icon, name, className, onClick, active }) => {
  return (
    <MenuTabContainer className={className} onClick={onClick} active={active}>
      <img src={icon} />
      <MenuName>{name}</MenuName>
    </MenuTabContainer>
  );
};

export default customizableComponent("MenuTab")(MenuTab);
