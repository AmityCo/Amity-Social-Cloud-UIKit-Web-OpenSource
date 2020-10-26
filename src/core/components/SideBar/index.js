import React, { useState } from 'react';
import customizableComponent from '~/core/hocs/customization';
import { SideNavContainer } from './styles';
import communityIcon from './icons/community.svg';
import MenuTab from './MenuTab';

const SideNavBar = () => {
  const [active, setActive] = useState(false);
  const Mockup = [{ name: 'COMMUNITY', icon: communityIcon }];
  return (
    <SideNavContainer>
      {Mockup.map(tab => (
        <MenuTab
          key={tab.name}
          active={active === tab.name}
          onClick={() => setActive(tab.name)}
          icon={tab.icon}
          name={tab.name}
        />
      ))}
    </SideNavContainer>
  );
};

export default customizableComponent('SideNavBar', SideNavBar);
