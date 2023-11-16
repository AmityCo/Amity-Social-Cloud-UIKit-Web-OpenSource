import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/pro-regular-svg-icons';

export default styled(FaIcon).attrs({ icon: faShare })`
  font-size: ${({ height = 'inherit' }) => height};
`;
