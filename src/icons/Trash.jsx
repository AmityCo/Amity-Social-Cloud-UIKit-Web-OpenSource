import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons';

export default styled(FontAwesomeIcon).attrs({ icon: faTrashAlt })`
  font-size: ${({ height = 'inherit' }) => height};
`;
