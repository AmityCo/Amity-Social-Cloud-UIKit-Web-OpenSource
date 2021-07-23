import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import PageHeader from '~/core/components/PageHeader';
import UITabs from '~/core/components/Tabs';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import { PageTabs } from '~/social/pages/CommunityEdit/constants';

const CommunitySettingsTabs = styled(UITabs)`
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 4px 4px 0 0;
  border: 1px solid #edeef2;
`;

const CommunityEditHeader = ({
  avatarFileUrl,
  communityName,
  onReturnToCommunity,
  tabs,
  activeTab,
  setActiveTab,
}) => (
  <>
    <PageHeader
      title={<FormattedMessage id="community.communitySettings" />}
      avatarFileUrl={avatarFileUrl}
      avatarImage={CommunityImage}
      backLinkText={<FormattedMessage id="community.returnTo" values={{ communityName }} />}
      onBack={onReturnToCommunity}
      hideBackArrow
    />
    <CommunitySettingsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
  </>
);

CommunityEditHeader.propTypes = {
  avatarFileUrl: PropTypes.string,
  communityName: PropTypes.string,
  onReturnToCommunity: PropTypes.func,
  tabs: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.node })),
  activeTab: PropTypes.oneOf(Object.values(PageTabs)),
  setActiveTab: PropTypes.func,
};

export default CommunityEditHeader;
