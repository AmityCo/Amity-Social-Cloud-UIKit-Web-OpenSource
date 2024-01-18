import React from 'react';
import PropTypes from 'prop-types';
import { EmptyStateContainer, EmptyStateTitle, EmptyStateDescription } from './styles';

const EmptyState = ({ icon, title, description, children }) => {
  return (
    <EmptyStateContainer>
      {icon}
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>
      {children}
    </EmptyStateContainer>
  );
};

EmptyState.defaultProps = {
  icon: null,
  title: null,
  description: null,
  children: null,
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node,
  description: PropTypes.node,
  children: PropTypes.node,
};

export default EmptyState;
