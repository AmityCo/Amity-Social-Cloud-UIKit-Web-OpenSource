import styled, { css } from 'styled-components';

export const Label = styled.label`
  display: grid;
  grid-template-areas: 'label chip';
  grid-template-columns: auto min-content;
  grid-template-rows: auto;
  grid-gap: 0.4rem;
  align-items: center;
  padding: 0.5rem 0.4rem 0.4rem;
  border-radius: 0.2rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.palette.base.shade4};
  }
`;

export const Radio = styled.input.attrs({ type: 'radio' })`
  &&& {
    appearance: none;
    position: absolute;
    outline: none;
  }
`;

const absoluteCentered = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const Chip = styled.div`
  grid-area: chip;
  position: relative;
  display: inline-block;
  width: 1.25rem;
  height 1.25rem;
  border: 1px solid ${({ theme }) => theme.palette.base.shade3};
  border-radius: 50%;

  ${({ checked, theme }) =>
    checked &&
    `
    background: ${theme.palette.system.background};
    border: 1px solid ${theme.palette.primary.main};

    &:after {
      ${absoluteCentered}
      content: '';
      width: .75rem;
      height: .75rem;
      background: ${theme.palette.primary.main};
      border-radius: 50%;
    }
  `}
`;
