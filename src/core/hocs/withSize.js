import React from 'react';

const DEFAULT_SIZE = 'regular';

export const SIZES = {
  big: 64,
  regular: 40,
  small: 32,
  tiny: 28,
};

const withSize = (Component, defaultSize = DEFAULT_SIZE) => {
  return ({ size = defaultSize, ...props }) => {
    const sizeValue = size in SIZES ? size : defaultSize;
    return <Component size={sizeValue} {...props} />;
  };
};

export default withSize;
