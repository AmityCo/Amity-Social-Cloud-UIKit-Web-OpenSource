import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';

export default styled(FontAwesomeIcon).attrs({ icon: faBadgeCheck })`
  font-size: ${({ height = 'inherit' }) => height};
`;
