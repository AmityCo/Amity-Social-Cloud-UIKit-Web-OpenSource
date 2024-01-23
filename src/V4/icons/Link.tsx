import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/pro-regular-svg-icons';
import { ReactNode } from 'react';

const Link = styled(FaIcon).attrs<{ icon?: ReactNode }>({ icon: faLink })`
  color: ${({ theme }) => theme.palette.base.shade3};
  font-size: ${({ height = 'inherit' }) => height};
`;

export default Link;
