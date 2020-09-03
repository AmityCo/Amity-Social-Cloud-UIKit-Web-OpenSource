import React, { useState } from 'react';
import { customizableComponent } from '../hoks/customization';
import { SideMenuContainer } from './styles';
import communityIcon from './icons/community.svg';
import MenuTab from './MenuTab';

const SideMenu = () => {
  const [active, setActive] = useState(false);
  const Mockup = [{ name: 'COMMUNITY', icon: communityIcon }];
  return (
    <SideMenuContainer>
      {Mockup.map(tab => (
        <MenuTab
          key={tab.name}
          active={active === tab.name}
          onClick={() => setActive(tab.name)}
          icon={tab.icon}
          name={tab.name}
        />
      ))}
    </SideMenuContainer>
  );
};

export default customizableComponent('SideMenu')(SideMenu);
