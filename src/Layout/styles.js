import styled from "styled-components";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";

export const LayoutHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #ffffff;
  border-bottom: 1px solid #ebecef;
  height: 60px;
  ${({ theme }) => theme.typography.body}
`;

export const Username = styled.div`
  margin-right: 6px;
  margin-left: 7px;
`;

export const DropdownIcon = styled(FaIcon).attrs({ icon: faCaretDown })`
  color: #292b32;
  margin-right: 76px;
  cursor: pointer;
`;
