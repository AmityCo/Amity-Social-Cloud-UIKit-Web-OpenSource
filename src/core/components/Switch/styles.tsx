import styled, { css } from 'styled-components';

const TRANSITION_TIME = '0.3s';

export const SwitchLabel = styled.label<{ disabled?: boolean }>`
  position: relative;
  width: 48px;
  height: 28px;
  float: right;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      cursor: not-allowed;
    `}
`;

export const SwitchInput = styled.input`
  &&& {
    display: none;
  }
`;

export const SwitchSlider = styled.span<{ disabled?: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.palette.base.shade4 : theme.palette.base.shade3};
  -webkit-transition: ${TRANSITION_TIME};
  transition: ${TRANSITION_TIME};
  border-radius: 14px;

  &:before {
    position: absolute;
    content: '';
    height: 24px;
    width: 24px;
    left: 2px;
    bottom: 2px;
    background-color: #fff;
    -webkit-transition: ${TRANSITION_TIME};
    transition: ${TRANSITION_TIME};
    border-radius: 50%;
  }

  ${SwitchInput}:checked + & {
    background-color: ${({ disabled, theme }) =>
      disabled ? theme.palette.primary.shade2 : theme.palette.primary.main};
  }

  ${SwitchInput}:checked + &:before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(20px);
    transform: translateX(20px);
  }
`;
