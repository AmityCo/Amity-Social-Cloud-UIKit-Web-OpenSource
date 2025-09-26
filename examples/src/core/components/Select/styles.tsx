import styled from 'styled-components';

export const DefaultTrigger = styled.button
  .withConfig({
    displayName: 'DefaultTrigger',
  })
  .attrs({ role: 'button' })`
  display: flex;
  height: 44px;
  min-width: 7rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  align-items: center;
  gap: 0.5rem;
  justify-self: stretch;
  background-color: #fff;
  color: #000;
  border-radius: 0.5rem;
  border: 1px solid #d3d3d3;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  text-align: left;
  width: 300px;
  > *:last-child {
    margin-left: auto;
  }
  &:hover {
    cursor: pointer;
  }
`;

export const ItemsContainer = styled.div.withConfig({
  displayName: 'ItemsContainer',
})`
  word-break: break-word;
  > * {
    margin: 0 3px;
  }
`;

// Replica della classe .select da global.css come styled component
export const SelectContainer = styled.div.withConfig({
  displayName: 'SelectContainer',
})`
  display: flex;
  height: 44px;
  min-width: 7rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  align-items: center;
  gap: 0.5rem;
  justify-self: stretch;
  background-color: #fff;
  color: #000;
  border-radius: 0.5rem;
  border: 1px solid #d3d3d3;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
`;

/* ====================================
   SELECT WITH FLOATING LABEL STYLES
   ==================================== */
export const SelectLabelContainer = styled.div.withConfig({
  displayName: 'SelectLabelContainer',
})`
  position: relative;
  display: block;
  width: 100%;
`;

export const SelectTrigger = styled.button
  .withConfig({
    displayName: 'SelectTrigger',
  })
  .attrs({ role: 'button' })<{
  $isOpen?: boolean;
  $hasValue?: boolean;
  $error?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  height: 2.75rem;
  min-width: 7rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  align-items: center;
  gap: 0.5rem;
  justify-self: stretch;
  border-radius: 0.5rem;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  text-align: left;
  width: 100%;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Default state */
  color: #909090;
  border: 1px solid #d3d3d3;
  background-color: #fff;

  /* Open state */
  ${({ $isOpen }) =>
    $isOpen &&
    `
    color: #222;
    border-color: #d3d3d3;
    background-color: #fff;
  `}

  /* Filled state */
  ${({ $hasValue, $isOpen }) =>
    $hasValue &&
    !$isOpen &&
    `
    color: #222;
    border-color: #909090;
  `}

  /* Error state - ONLY when not open */
  ${({ $error, $isOpen }) =>
    $error &&
    !$isOpen &&
    `
    color: #222;
    border-color: #e32219;
    background-color: #fff;
  `}

  /* Disabled state */
  ${({ $disabled }) =>
    $disabled &&
    `
    color: #909090;
    background-color: #f2f2f2;
    cursor: not-allowed;
  `}

  /* Open + hover state - HIGHEST PRIORITY (green border when open, even with errors) */
  ${({ $isOpen, $disabled }) =>
    $isOpen &&
    !$disabled &&
    `
    border-color: #bed62f;
    
    &:hover {
      border-color: #bed62f;
    }
  `}

  > *:last-child {
    margin-left: auto;
  }
`;

export const SelectLabel = styled.label.withConfig({
  displayName: 'SelectLabel',
})<{
  $isActive?: boolean;
  $error?: boolean;
  $disabled?: boolean;
  $isOpen?: boolean;
}>`
  pointer-events: none;
  position: absolute;
  left: 0.5rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-radius: 9999px;
  background-color: #fff;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;

  /* Default position (center) */
  font-size: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #909090;

  /* Active position (top) */
  ${({ $isActive }) =>
    $isActive &&
    `
    top: 0;
    font-size: 0.75rem;
    transform: translateY(-50%);
  `}

  /* Error state */
  ${({ $error, $isOpen }) =>
    $error &&
    !$isOpen &&
    `
    color: #e32219;
  `}

  /* Open + hover state */
  ${({ $isOpen, $disabled }) =>
    $isOpen &&
    !$disabled &&
    `
    color: #bed62f;
  `}

  /* Filled state */
  ${({ $isActive, $error, $isOpen }) =>
    $isActive &&
    !$error &&
    !$isOpen &&
    `
    color: #909090;
  `}

  /* Disabled state */
  ${({ $disabled }) =>
    $disabled &&
    `
    background-color: #f2f2f2;
    color: #909090;
  `}
`;

export const SelectPlaceholderText = styled.div.withConfig({
  displayName: 'SelectPlaceholderText',
})<{
  $hasValue?: boolean;
  $isLabelActive?: boolean;
}>`
  color: inherit;

  /* Only show when there's a selected value */
  ${({ $hasValue }) =>
    $hasValue
      ? `
    opacity: 1;
  `
      : `
    opacity: 0;
    pointer-events: none;
  `}
`;
