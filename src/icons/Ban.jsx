import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/pro-regular-svg-icons';

export default styled(FaIcon).attrs({ icon: faBan })`
  color: ${({ theme }) => theme.palette.base.shade3};
  font-size: ${({ height = 'inherit' }) => height};
`;
