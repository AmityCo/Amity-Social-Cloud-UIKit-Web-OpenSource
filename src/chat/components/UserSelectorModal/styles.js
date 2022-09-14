import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '~/core/components/Button';

export const PrependIconWrapper = styled.span`
  display: flex;
  width: 28px;
  justify-content: flex-end;
  align-items: center;
  color: rgb(153, 153, 153);

  svg {
    width: 16px;
  }
`;

export const WrapSearch = styled.div`
  padding: 8px;
  border-style: solid;
  border-color: rgb(228, 228, 228);
  border-image: initial;
  border-width: 1px 0px;
  margin-top: -1px;
  background-color: rgb(249, 249, 249);
`;

export const WrapResult = styled.div`
  display: flex;
  height: 350px;
  flex-direction: column;
  overflow: auto;
`;

export const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const OkButton = styled(PrimaryButton)`
  margin-left: 15px;
`;

export const CancelButton = styled(SecondaryButton)``;
