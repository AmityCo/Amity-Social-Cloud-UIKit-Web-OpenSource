import PropTypes from 'prop-types';
import React from 'react';
import ReactLoadingSkeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Skeleton = ({ circle, borderRadius, primaryColor, secondaryColor, style, ...props }) => {
  return (
    <ReactLoadingSkeleton
      {...props}
      circle={circle}
      style={{
        ...style,
        backgroundColor: primaryColor,
        backgroundImage: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
        borderRadius: circle ? undefined : borderRadius,
      }}
    />
  );
};

Skeleton.propTypes = {
  borderRadius: PropTypes.number,
  circle: PropTypes.bool,
  duration: PropTypes.number,
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Skeleton.defaultProps = {
  circle: false,
  borderRadius: 12,
  duration: 2,
  primaryColor: '#EBECEF',
  secondaryColor: '#f3f3f3',
};

export default Skeleton;
