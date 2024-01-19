import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '~/core/components/Button';

export const WrapContent = styled.div`
  display: flex;
  padding: 0px 15px 10px;
`;

export const InputGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

export const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const OkButton = styled(PrimaryButton)`
  margin-left: 15px;
`;

export const CancelButton = styled(SecondaryButton)``;
