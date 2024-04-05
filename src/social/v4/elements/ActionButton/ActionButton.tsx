import React from 'react';
import styled from 'styled-components';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

const StyledActionButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${({ theme }) => theme.v4.colors.actionButton.default};
  color: ${({ theme }) => theme.v4.colors.baseInverse.default};
  cursor: pointer;
  padding: 0.1875rem 0rem;
  border-radius: 50%;
  transition: background-color 0.3s;
  flex-shrink: 0;
`;

export const ActionButton: React.FC<ActionButtonProps> = ({ icon, ...rest }) => {
  return <StyledActionButton {...rest}>{icon}</StyledActionButton>;
};
