// eslint-disable-next-line no-unused-vars
import React from 'react';

export const ConditionalRender = ({ condition, children }) => {
  return condition ? children : null;
};
