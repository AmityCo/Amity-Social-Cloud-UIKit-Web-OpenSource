import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/pro-solid-svg-icons';
import { ReactNode } from 'react';

export default styled(FaIcon).attrs<{ icon?: ReactNode }>({ icon: faShieldAlt })`
  font-size: ${({ height = 'inherit' }) => height};
`;
