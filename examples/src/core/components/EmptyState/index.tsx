import React from 'react';
import { EmptyStateContainer, EmptyStateTitle, EmptyStateDescription } from './styles';

export interface EmptyStateProps {
  className?: string;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

const EmptyState = ({ className, icon, title, description, children }: EmptyStateProps) => {
  return (
    <EmptyStateContainer className={className}>
      {icon}
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>
      {children}
    </EmptyStateContainer>
  );
};

export default EmptyState;
