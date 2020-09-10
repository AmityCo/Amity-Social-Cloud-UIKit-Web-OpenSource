import styled from 'styled-components';

export const ButtonLink = styled.button.attrs({ role: 'button' })`
  color: #636878;
  font-size: 14px;
  border: none;
  outline: none;
  background: none;
  padding: 4px 0 4px 0px;

  &:hover {
    cursor: pointer;
    color: #818698;
  }
`;
