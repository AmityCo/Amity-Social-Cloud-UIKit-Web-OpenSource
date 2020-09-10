import React from 'react';
import { useHistory } from 'react-router-dom';

import { ButtonLink } from './styles';

export const BackLink = ({ text }) => {
  const history = useHistory();
  const handleClick = () => {
    history.goBack();
  };
  return <ButtonLink onClick={handleClick}>{text}</ButtonLink>;
};
