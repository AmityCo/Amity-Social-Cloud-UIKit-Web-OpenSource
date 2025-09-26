import { useMedia } from 'react-use';

export const useResponsive = () => {
  const isDesktop = useMedia('(width >= 48em)');
  return { isDesktop };
};
