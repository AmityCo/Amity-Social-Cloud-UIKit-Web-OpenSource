import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { CommunityAlt } from '~/icons';
import { SideNavContainer } from './styles';
import MenuTab from './MenuTab';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

const SideNavBar = () => {
  const [activeTab, setActiveTab] = useState<string | undefined>();
  const { formatMessage } = useIntl();

  const Mockup = [{ name: formatMessage({ id: 'sidebar.community' }), icon: <CommunityAlt /> }];

  return (
    <SideNavContainer>
      {Mockup.map((tab) => (
        <MenuTab
          key={tab.name}
          active={activeTab === tab.name}
          icon={tab.icon}
          name={tab.name}
          onClick={() => setActiveTab(tab.name)}
        />
      ))}
    </SideNavContainer>
  );
};

export default memo(() => {
  const CustomComponentFn = useCustomComponent('SideNavBar');

  if (CustomComponentFn) return CustomComponentFn({});

  return <SideNavBar />;
});
