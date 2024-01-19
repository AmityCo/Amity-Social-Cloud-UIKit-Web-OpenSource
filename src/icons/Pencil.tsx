import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/pro-regular-svg-icons';
import { ReactNode } from 'react';

export default styled(FaIcon).attrs<{ icon?: ReactNode }>({ icon: faPencil })`
  font-size: ${({ height = 'inherit' }) => height};
`;
