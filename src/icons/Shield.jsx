import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/pro-solid-svg-icons';

export default styled(FaIcon).attrs({ icon: faShieldAlt })`
  font-size: ${({ height = 'inherit' }) => height};
`;
