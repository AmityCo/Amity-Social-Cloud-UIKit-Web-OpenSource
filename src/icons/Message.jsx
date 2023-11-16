import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsAlt } from '@fortawesome/pro-regular-svg-icons';

export default styled(FontAwesomeIcon).attrs({ icon: faCommentsAlt })`
  font-size: ${({ height = 'inherit' }) => height};
`;
