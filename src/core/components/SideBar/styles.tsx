import styled from 'styled-components';

export const SideNavContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  background-color: #ffffff;
  border-right: 1px solid #ebecef;
  flex-shrink: 0;
  flex-grow: 0;
  width: 77px;
`;

export const MenuName = styled.div`
  display: flex;
  color: #1054de;
  font-size: 10px;
  word-break: break-word;
  white-space: normal;
`;

export const MenuTabContainer = styled.div<{ active?: boolean }>`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  width: 100%;
  height: 64px;
  cursor: pointer;
  ${({ active }) => active && 'border-left: 2px solid #1054DE;  background-color: #ebecef;'}
  ${({ theme }) => theme.typography.captionBold}
`;
