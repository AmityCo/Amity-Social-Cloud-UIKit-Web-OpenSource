import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/pro-regular-svg-icons';

export default styled(FontAwesomeIcon).attrs({ icon: faUserPlus })`
  font-size: ${({ height = 'inherit' }) => height};
`;
