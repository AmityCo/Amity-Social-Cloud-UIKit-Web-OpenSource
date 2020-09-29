import React from 'react';

import { LoadingIndicator } from './styles';

export const ProgressBar = ({ progress, lightMode }) => {
  return <LoadingIndicator progress={progress} lightMode={lightMode} />;
};
