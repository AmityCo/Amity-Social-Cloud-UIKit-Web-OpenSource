import styled from 'styled-components';

export const ReactionListContainer = styled.div`
  border-radius: 0.25rem;
  overflow: hidden;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const TabList = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  height: 3rem;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.v4.colors.base.shade4};
  gap: 1.25rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const TabItem = styled.li<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rem 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: 0.125rem solid transparent;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ theme }) => theme.v4.colors.base.shade4};
  }

  ${({ active, theme }) =>
    active &&
    `
    border-bottom-color: ${theme.v4.colors.primary.default};
    color: ${theme.v4.colors.primary.default};
  `}
`;

export const TabCount = styled.span`
  margin-left: 0.25rem;
`;

export const UserList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
  max-height: calc(100% - 3rem);
`;

export const UserItem = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.v4.colors.base.shade4};

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.v4.colors.base.shade4};
  }
`;

export const Divider = styled.hr`
  border: none;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.v4.colors.base.shade4};
  margin: 0.5rem 0;

  &:last-child {
    display: none;
  }
`;

export const ReactionEmoji = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const UserDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
