import styled from 'styled-components';
import Tabs from '~/core/components/Tabs';

export const CommunityMembersTabs = styled(Tabs)`
  margin-bottom: 14px;
  border-radius: 0;
  border-right: 0;
  border-left: 0;
`;

export const CommunityMembersContainer = styled.div`
  background: ${({ theme }) => theme.palette.system.background};
  border: 1px solid #edeef2;
  border-radius: 4px;
  flex: 2;
`;

export const CommunityMembersHeader = styled.div`
  ${({ theme }) => theme.typography.title};
  padding: 16px;
`;

export const CommunityMemberContainer = styled.div`
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
