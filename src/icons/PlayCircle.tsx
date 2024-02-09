import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/pro-light-svg-icons';
import { ReactNode } from 'react';

export default styled(FaIcon).attrs<{ icon?: ReactNode }>({ icon: faPlayCircle })`
  font-size: ${({ height = 'inherit' }) => height};
`;
