import React from 'react';

import { LoadingIndicator } from './styles';

const ProgressBar = ({ progress, lightMode }) => {
  return <LoadingIndicator progress={progress} lightMode={lightMode} />;
};

export default ProgressBar;
