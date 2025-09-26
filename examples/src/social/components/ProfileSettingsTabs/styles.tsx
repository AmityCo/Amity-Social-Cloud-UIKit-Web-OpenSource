import styled from 'styled-components';
import UITabs from '~/core/components/Tabs';

export const ProfileSettingsTabs = styled(UITabs)`
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 4px 4px 0 0;
  border: 1px solid #edeef2;
`;
