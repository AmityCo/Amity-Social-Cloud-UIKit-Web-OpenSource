export const POSITION_TOP = 'top';
export const POSITION_RIGHT = 'right';
export const POSITION_BOTTOM = 'bottom';
export const POSITION_LEFT = 'left';

const getCssPosition = (position = 'bottom') => {
  if (position === POSITION_BOTTOM) {
    return `top: 100%;`;
  }

  if (position === POSITION_LEFT) {
    return 'left: 0px;';
  }

  if (position === POSITION_RIGHT) {
    return 'right: 0px;';
  }

  return `bottom: 100%;`;
};

export default getCssPosition;
