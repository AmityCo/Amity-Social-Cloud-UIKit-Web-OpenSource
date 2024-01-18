import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSolarSystem } from '@fortawesome/pro-regular-svg-icons';

export default styled(FontAwesomeIcon).attrs({ icon: faSolarSystem })`
  font-size: ${({ height = 'inherit' }) => height};
`;
