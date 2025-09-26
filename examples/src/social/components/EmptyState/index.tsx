import React, { ReactNode } from 'react';
import { EmptyStateContainer, EmptyStateTitle, EmptyStateDescription } from './styles';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

const EmptyState = ({ icon, title, description, children }: EmptyStateProps) => {
  return (
    <EmptyStateContainer>
      {icon}
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>
      {children}
    </EmptyStateContainer>
  );
};

export default EmptyState;
