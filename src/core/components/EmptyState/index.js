import React from 'react';
import PropTypes from 'prop-types';
import { EmptyStateContainer, EmptyStateTitle, EmptyStateDescription } from './styles';

const EmptyState = ({ className, icon, title, description, children }) => {
  return (
    <EmptyStateContainer className={className}>
      {icon}
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>
      {children}
    </EmptyStateContainer>
  );
};

EmptyState.defaultProps = {
  className: null,
  icon: null,
  title: null,
  description: null,
  children: null,
};

EmptyState.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.node,
  description: PropTypes.node,
  children: PropTypes.node,
};

export default EmptyState;
