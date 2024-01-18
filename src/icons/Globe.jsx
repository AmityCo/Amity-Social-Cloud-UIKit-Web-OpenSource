import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAfrica } from '@fortawesome/pro-regular-svg-icons';

export default styled(FontAwesomeIcon).attrs({ icon: faGlobeAfrica })`
  font-size: ${({ height = 'inherit' }) => height};
`;
