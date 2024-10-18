import React, { useState } from 'react';

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallBackRenderer?: () => JSX.Element | null;
}

export const Img = ({ fallBackRenderer, src, ...props }: ImgProps) => {
  const [isError, setIsError] = useState(false);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsError(true);
  };

  if (isError || src == undefined) {
    if (fallBackRenderer) {
      return fallBackRenderer();
    }
    return null;
  }

  return <img {...props} src={src} onError={handleError} />;
};
