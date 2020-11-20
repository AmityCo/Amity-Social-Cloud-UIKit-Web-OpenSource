import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';

import UITabs from '~/core/components/Tabs';

const CommunitySettingsTabs = styled(UITabs)`
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 4px 4px 0 0;
  border: 1px solid #edeef2;
`;

export default customizableComponent('CommunitySettingsTabs', CommunitySettingsTabs);
