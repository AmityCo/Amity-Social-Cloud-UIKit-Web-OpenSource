import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';

export default styled(FontAwesomeIcon).attrs({ icon: faChevronDown })`
  font-size: ${({ height = 'inherit' }) => height};
`;
