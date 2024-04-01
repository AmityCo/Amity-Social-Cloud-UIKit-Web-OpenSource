import styled from 'styled-components';
import { SecondaryButton } from '~/core/components/Button';

import { Trash2Icon } from '~/icons';

export const HyperlinkFormContainer = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-bottom: 1px solid
    ${({ hasError, theme }) =>
      hasError ? theme.v4.colors.alert.default : theme.v4.colors.base.shade4};
  outline: none;
  color: ${({ hasError, theme }) => (hasError ? theme.v4.colors.alert.default : 'inherit')};
`;

export const Label = styled.label<{ required?: boolean }>`
  ${({ theme }) => theme.v4.typography.title};
  display: block;

  &::after {
    content: ${({ required }) => (required ? "'*'" : 'none')};
    color: ${({ theme }) => theme.v4.colors.alert.default};
  }
`;

export const Description = styled.label`
  ${({ theme }) => theme.v4.typography.caption};
  color: ${({ theme }) => theme.v4.colors.base.shade2};
`;

export const ErrorText = styled.span`
  ${({ theme }) => theme.v4.typography.caption};
  color: ${({ theme }) => theme.v4.colors.alert.default};
`;

export const CharacterCount = styled.div`
  ${({ theme }) => theme.v4.typography.caption};
  color: ${({ theme }) => theme.v4.colors.base.shade1};
  text-align: right;
  margin-top: 0.3rem;
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;

export const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.div`
  ${({ theme }) => theme.v4.typography.title};
`;

export const StyledSecondaryButton = styled(SecondaryButton)`
  color: ${({ theme }) => theme.v4.colors.primary.default};
`;

export const RemoveIcon = styled(Trash2Icon)`
  width: 1.5rem;
  height: 1.5rem;
  fill: ${({ theme }) => theme.v4.colors.alert.default};
`;

export const RemoveLinkButton = styled(SecondaryButton)`
  ${({ theme }) => theme.v4.typography.body};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.v4.colors.alert.default};
  border-radius: 0;
`;

export const Divider = styled.div`
  width: 100%;
  height: 0.0625rem;
  align-self: stretch;
  background-color: ${({ theme }) => theme.v4.colors.base.shade4};
`;
