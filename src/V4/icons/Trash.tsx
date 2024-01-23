import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/pro-regular-svg-icons';
import { ReactNode } from 'react';

const Trash = styled(FaIcon).attrs<{ icon?: ReactNode }>({ icon: faTrash })`
  color: ${({ theme }) => theme.palette.base.shade3};
  font-size: ${({ height = 'inherit' }) => height};
`;

export default Trash;
