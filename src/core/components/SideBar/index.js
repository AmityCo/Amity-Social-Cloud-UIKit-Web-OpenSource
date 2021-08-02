import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import customizableComponent from '~/core/hocs/customization';
import { CommunityAlt } from '~/icons';
import { SideNavContainer } from './styles';
import MenuTab from './MenuTab';

const SideNavBar = () => {
  const [active, setActive] = useState(false);
  const { formatMessage } = useIntl();

  const Mockup = [{ name: formatMessage({ id: 'sidebar.community' }), icon: <CommunityAlt /> }];

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

export default memo(customizableComponent('SideNavBar', SideNavBar));
