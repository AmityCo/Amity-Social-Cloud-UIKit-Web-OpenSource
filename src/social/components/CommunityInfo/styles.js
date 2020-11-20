import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import UIOptionMenu from '~/core/components/OptionMenu';
import { PrimaryButton } from '~/core/components/Button';

export const PlusIcon = styled(FaIcon).attrs({ icon: faPlus })`
  font-size: 15px;
  margin-right: 8px;
`;

export const OptionMenu = styled(UIOptionMenu)`
  margin-left: auto;
`;

export const Container = styled.div`
  border: 1px solid #edeef2;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.system.background};
  width: 330px;
  flex-shrink: 0;
  align-self: flex-start;
  padding: 16px;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const CategoriesList = styled.div`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const Count = styled.span`
  & > .countNumber {
    ${({ theme }) => theme.typography.bodyBold}
  }
`;

export const Description = styled.div`
  margin: 8px 0 12px;
  word-break: break-all;
`;

export const JoinButton = styled(PrimaryButton)`
  width: 100%;
  justify-content: center;
`;

export const CountsContainer = styled.div`
  margin-bottom: 12px;
  & > ${Count} {
    margin-right: 8px;
  }
`;
