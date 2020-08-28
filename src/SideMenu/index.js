import React from "react";
import { customizableComponent } from "../hoks/customization";
import { SideMenuContainer } from "./styles";
import communityIcon from "./icons/community.svg";
import MenuTab from "./MenuTab";

const SideMenu = () => {
  const test = () => alert("test");
  return (
    <SideMenuContainer>
      <MenuTab
        onClick={test}
        active={true}
        icon={communityIcon}
        name={"COMMUNITYYYYYYY"}
      />
    </SideMenuContainer>
  );
};

export default customizableComponent("SideMenu")(SideMenu);
