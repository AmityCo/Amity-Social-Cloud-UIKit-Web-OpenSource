import styled from 'styled-components';

export const CommunityPermissionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0px;
  gap: 1rem;
`;

export const CommunityPermissionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.system.background};
  border: 1px solid #edeef2;
  border-radius: 4px;
`;

export const CommunityPermissionsItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CommunityPermissionsHeader = styled.div`
  padding: 12px 16px;
  ${({ theme }) => theme.typography.title};

  border-bottom: 1px solid ${({ theme }) => theme.palette.base.shade4};
`;

export const CommunityPermissionsBody = styled.div`
  padding: 12px 16px;
`;

export const SwitchItemContainer = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    flex: 1 1 0px;
  }

  > :nth-child(2) {
    flex: 0 0 auto;
    margin-left: 20px;
  }
`;

export const SwitchItemDescription = styled.div``;

export const SwitchItemName = styled.div`
  ${({ theme }) => theme.typography.bodyBold}
`;

export const SwitchItemPrompt = styled.div`
  color: ${({ theme }) => theme.palette.base.shade2};
`;
