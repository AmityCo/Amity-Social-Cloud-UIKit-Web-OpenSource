import React from 'react';

const DEFAULT_SIZE = 'regular';

export const SIZE_ALIAS = {
  BIG: 'big',
  REGULAR: 'regular',
  SMALL: 'small',
  TINY: 'tiny',
};

export const SIZE_TO_WAX = {
  [SIZE_ALIAS.BIG]: 'xl',
  [SIZE_ALIAS.REGULAR]: 'md',
  [SIZE_ALIAS.SMALL]: 'sm',
  [SIZE_ALIAS.TINY]: 'xs',
};

export const SIZES = {
  [SIZE_ALIAS.BIG]: 64,
  [SIZE_ALIAS.REGULAR]: 40,
  [SIZE_ALIAS.SMALL]: 32,
  [SIZE_ALIAS.TINY]: 28,
};

const withSize = (Component, defaultSize = DEFAULT_SIZE) => {
  return ({ size = defaultSize, ...props }) => {
    const sizeValue = size in SIZES ? size : defaultSize;
    return <Component size={sizeValue} {...props} />;
  };
};

export default withSize;
