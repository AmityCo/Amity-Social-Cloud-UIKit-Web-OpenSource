import styled from 'styled-components';

export const SocialMentionDropdownContainer = styled.div`
  min-width: 22.5rem;
  max-height: 17.5rem;
  padding: 0.625rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem ${({ theme }) => theme.palette.base.shade4};
  overflow: auto;
`;

export const SocialMentionDropdownItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
`;

export const Name = styled.span`
  display: inline-block;
  margin-left: 0.75rem;
`;
