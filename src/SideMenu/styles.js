import styled from "styled-components";

export const SideMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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

export const MenuTabContainer = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  width: 100%;
  height: 64px;
  cursor: pointer;
  border-bottom: 1px solid #ebecef;
  border-left: 1px solid #ebecef;
  ${({ active }) =>
    active && "border-left: 2px solid #1054DE;  background-color: #ebecef;"}
  ${({ theme }) => theme.typography.captionBold}
`;

export const CommunityIcon = styled.div``;
