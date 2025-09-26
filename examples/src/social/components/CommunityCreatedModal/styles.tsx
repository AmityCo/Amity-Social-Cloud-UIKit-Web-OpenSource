import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '~/core/components/Button';

export const Content = styled.div`
  padding: 70px 30px 30px;
  max-width: 360px;
  text-align: center;
`;

export const Title = styled.div`
  margin-top: 25px;
  ${({ theme }) => theme.typography.headline}
`;

export const Message = styled.p`
  margin-top: 8px;
  color: ${({ theme }) => theme.palette.shade1};
`;

export const GoToSettingsButton = styled(PrimaryButton)`
  display: block;
  margin: 25px auto 0 auto;
`;

export const SkipButton = styled(SecondaryButton)`
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 0 0 0 4px;
  margin-top: 20px;

  &:hover {
    background: none;
    text-decoration: underline;
  }
`;
