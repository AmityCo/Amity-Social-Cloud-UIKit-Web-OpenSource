import React from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';

export const SKELETON_SHAPES = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
};

const propTypes = {
  shape: PropTypes.oneOf(Object.values(SKELETON_SHAPES)),
  borderRadius: PropTypes.number,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
};

const defaultProps = {
  shape: SKELETON_SHAPES.RECTANGLE,
  borderRadius: 6,
  primaryColor: '#f8f8f8',
  secondaryColor: '#f3f3f3',
};

function Skeleton({ shape, borderRadius, primaryColor, secondaryColor }) {
  return (
    <ContentLoader
      backgroundColor={primaryColor}
      foregroundColor={secondaryColor}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
    >
      {shape === SKELETON_SHAPES.CIRCLE ? (
        <circle cx="50%" cy="50%" r="50%" />
      ) : (
        <rect x="0" y="0" rx={borderRadius} ry={borderRadius} width="100%" height="100%" />
      )}
    </ContentLoader>
  );
}

Skeleton.propTypes = propTypes;
Skeleton.defaultProps = defaultProps;

export default Skeleton;
