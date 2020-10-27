import React from 'react';
import { useHistory } from 'react-router-dom';

import { ButtonLink } from './styles';

const BackLink = ({ text }) => {
  const history = useHistory();
  const handleClick = () => {
    history.goBack();
  };
  return <ButtonLink onClick={handleClick}>{text}</ButtonLink>;
};

export default BackLink;
