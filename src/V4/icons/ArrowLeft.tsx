import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { ReactNode } from 'react';

const ArrowLeft = styled(FaIcon).attrs<{ icon?: ReactNode }>({ icon: faArrowLeft })`
  color: ${({ theme }) => theme.palette.base.shade3};
  font-size: ${({ height = 'inherit' }) => height};
`;

export default ArrowLeft;
