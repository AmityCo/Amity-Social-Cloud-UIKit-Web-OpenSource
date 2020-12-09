import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';

export default styled(FontAwesomeIcon).attrs({ icon: faExclamationCircle })`
  font-size: ${({ height = 'inherit' }) => height};
`;
