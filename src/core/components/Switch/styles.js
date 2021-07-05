import styled from 'styled-components';

const TRANSITION_TIME = '0.3s';

export const SwitchLabel = styled.label`
  position: relative;
  width: 48px;
  height: 28px;
  float: right;
`;

export const SwitchInput = styled.input`
  &&& {
    display: none;
  }
`;

export const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.palette.base.shade3};
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
    background-color: ${({ theme }) => theme.palette.primary.main};
  }

  ${SwitchInput}:checked + &:before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(20px);
    transform: translateX(20px);
  }
`;
