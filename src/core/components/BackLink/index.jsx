import React from 'react';
import { useNavigation } from '~/social/providers/NavigationProvider';

import { ButtonLink } from './styles';

const BackLink = ({ text }) => {
  const { onBack } = useNavigation();
  return <ButtonLink onClick={onBack}>{text}</ButtonLink>;
};

export default BackLink;
