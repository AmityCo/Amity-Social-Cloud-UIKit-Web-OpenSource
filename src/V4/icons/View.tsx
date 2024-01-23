import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-regular-svg-icons';
import { ReactNode } from 'react';

const View = styled(FaIcon).attrs<{ icon?: ReactNode }>({ icon: faEye })`
  color: ${({ theme }) => theme.palette.base.shade3};
  font-size: ${({ height = 'inherit' }) => height};
`;

export default View;
