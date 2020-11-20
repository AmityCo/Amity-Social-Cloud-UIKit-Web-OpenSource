const DEFAULT_OFFSET = 0;

export const POSITION_TOP = 'top';
export const POSITION_RIGHT = 'right';
export const POSITION_BOTTOM = 'bottom';
export const POSITION_LEFT = 'left';

const getCssPosition = (position = 'bottom', offset = DEFAULT_OFFSET) => {
  if (position === POSITION_BOTTOM) {
    return `top: ${offset}px;`;
  }

  if (position === POSITION_LEFT) {
    return 'left: 0px;';
  }

  if (position === POSITION_RIGHT) {
    return 'right: 0px;';
  }

  return `bottom: ${offset}px;`;
};

export default getCssPosition;
