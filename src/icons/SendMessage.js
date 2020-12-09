import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp } from '@fortawesome/pro-solid-svg-icons';

export default styled(FaIcon).attrs({ icon: faArrowCircleUp })`
  font-size: ${({ height = 'inherit' }) => height};
`;
