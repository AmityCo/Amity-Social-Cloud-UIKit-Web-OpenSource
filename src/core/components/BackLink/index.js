import React from 'react';
import { useNavigation } from '~/social/providers/NavigationProvider';

import { ButtonLink } from './styles';

const BackLink = ({ text, onClick }) => {
  const { onBack } = useNavigation();
  return <ButtonLink onClick={onClick ?? onBack}>{text}</ButtonLink>;
};

export default BackLink;
