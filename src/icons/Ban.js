import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/pro-regular-svg-icons';

export default styled(FaIcon).attrs({ icon: faBan })`
  font-size: ${({ height = 'inherit' }) => height};
`;
