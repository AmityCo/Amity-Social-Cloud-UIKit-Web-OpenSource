import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/pro-regular-svg-icons';

export default styled(FaIcon).attrs({ icon: faPencil })`
  font-size: ${({ height = 'inherit' }) => height};
`;
