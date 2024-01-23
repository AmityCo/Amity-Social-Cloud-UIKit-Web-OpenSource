import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/pro-regular-svg-icons';
import { ReactNode } from 'react';

const Aspect = styled(FaIcon).attrs<{ icon?: ReactNode }>({ icon: faExpand })`
  color: ${({ theme }) => theme.palette.base.shade3};
  font-size: ${({ height = 'inherit' }) => height};
`;

export default Aspect;
