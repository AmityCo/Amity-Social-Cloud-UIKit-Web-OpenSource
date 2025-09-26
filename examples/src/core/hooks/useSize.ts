import React, { useMemo } from 'react';

export const SIZE_ALIAS = {
  BIG: 'big',
  REGULAR: 'regular',
  SMALL: 'small',
  TINY: 'tiny',
};

const DEFAULT_SIZE = SIZE_ALIAS.REGULAR;

export const SIZES = {
  [SIZE_ALIAS.BIG]: 64,
  [SIZE_ALIAS.REGULAR]: 40,
  [SIZE_ALIAS.SMALL]: 32,
  [SIZE_ALIAS.TINY]: 28,
};

const useSize = (size?: ValueOf<typeof SIZE_ALIAS> | null) => {
  const sizeValue = useMemo(() => {
    if (size && SIZES[size]) {
      return size;
    }
    return DEFAULT_SIZE;
  }, [size]);
  return sizeValue;
};

export default useSize;
