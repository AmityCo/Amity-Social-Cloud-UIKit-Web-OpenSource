import React from 'react';
import { useNavigation } from '~/social/providers/NavigationProvider';

import { ButtonLink } from './styles';

interface BackLinkProps {
  text: string;
}

const BackLink = ({ text }: BackLinkProps) => {
  const { onBack } = useNavigation();
  return <ButtonLink onClick={onBack}>{text}</ButtonLink>;
};

export default BackLink;
