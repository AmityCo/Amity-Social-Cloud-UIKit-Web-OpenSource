import React from 'react';

import { LoadingIndicator } from './styles';

interface ProgressBarProps {
  progress: number;
  lightMode?: boolean;
}

const ProgressBar = ({ progress, lightMode }: ProgressBarProps) => {
  return <LoadingIndicator progress={progress} lightMode={lightMode} />;
};

export default ProgressBar;
