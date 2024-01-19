import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import PageHeader from '~/core/components/PageHeader';
import UITabs from '~/core/components/Tabs';
import { backgroundImage as CommunityImage } from '~/icons/Community';

const CommunitySettingsTabs = styled(UITabs)`
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 4px 4px 0 0;
  border: 1px solid #edeef2;
`;

interface CommunityEditHeaderProps {
  avatarFileUrl?: string;
  communityName?: string;
  tabs?: { value: string; label: React.ReactNode }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onReturnToCommunity?: () => void;
}

const CommunityEditHeader = ({
  avatarFileUrl,
  communityName,
  onReturnToCommunity,
  tabs = [],
  activeTab,
  onTabChange,
}: CommunityEditHeaderProps) => (
  <>
    <PageHeader
      title={<FormattedMessage id="community.communitySettings" />}
      avatarFileUrl={avatarFileUrl}
      avatarImage={CommunityImage}
      backLinkText={<FormattedMessage id="community.returnTo" values={{ communityName }} />}
      onBack={onReturnToCommunity}
    />
    {tabs.length > 0 ? (
      <CommunitySettingsTabs
        tabs={tabs}
        activeTab={activeTab || tabs[0].value}
        onChange={(newTab) => onTabChange?.(newTab)}
      />
    ) : null}
  </>
);

export default CommunityEditHeader;
