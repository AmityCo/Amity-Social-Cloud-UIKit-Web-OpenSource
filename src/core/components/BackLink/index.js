import { useNavigation } from '~/social/providers/NavigationProvider';

import { ButtonLink } from './styles';

const BackLink = ({ className, text }) => {
  const { onBack } = useNavigation();
  return (
    <ButtonLink className={className} onClick={onBack}>
      {text}
    </ButtonLink>
  );
};

export default BackLink;
