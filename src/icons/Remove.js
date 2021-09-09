import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';

export default styled(FaIcon).attrs({ icon: faTimes })`
  && {
    font-size: ${({ height = 'inherit' }) => height};
  }
`;
