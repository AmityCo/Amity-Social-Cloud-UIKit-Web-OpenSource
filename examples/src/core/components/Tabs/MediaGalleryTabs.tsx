import styled from 'styled-components';
import { TabButton, TabItem, TabsContainer, TabsList } from './styles';
import Tabs from '.';

export default styled(Tabs)`
  &${TabsContainer} {
    border: none;
  }

  ${TabsList} {
    padding: 0;
  }

  ${TabItem} {
    &:not(:first-child) {
      margin-left: 0.75em;
    }
  }

  ${TabButton} {
    margin: 0;
    padding: 0.5em 0.75em;
    background: #ebecef;
    border-radius: 1.5em;
    ${({ theme }) => theme.typography.body}

    &.active {
      background: ${({ theme }) => theme.palette.primary.main};
      color: #fff;
      ${({ theme }) => theme.typography.bodyBold}
      border-bottom: none;
    }
  }
`;
