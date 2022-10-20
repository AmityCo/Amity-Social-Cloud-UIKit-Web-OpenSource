import styled from 'styled-components';
import Button, { PrimaryButton } from '~/core/components/Button';
import { Plus } from '~/icons';

export const ExtraActionContainer = styled.div`
  border: 1px solid #edeef2;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.system.background};
  align-self: flex-start;
  padding: 16px;
  width: 100%;
  flex-shrink: 0;
`;

export const ExtraActionContainerHeader = styled.div`
  ${({ theme }) => theme.typography.title};
  line-height: 24px;
`;

export const ExtraActionContainerBody = styled.div`
  ${({ theme }) => theme.typography.body};
  line-height: 20px;
`;

export const Footer = styled.div`
  margin-top: 16px;
`;

export const ExtraActionPrimaryButton = styled(PrimaryButton)`
  padding: 10px 16px;
  justify-content: center;
  width: 100%;
`;

export const ExtraActionButton = styled(Button)`
  padding: 10px 16px;
  justify-content: center;
  width: 100%;
`;

export const PlusIcon = styled(Plus).attrs({ width: 15, height: 15 })`
  margin-right: 8px;
`;
