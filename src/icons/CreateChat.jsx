import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAltPlus } from '@fortawesome/pro-regular-svg-icons';

export default styled(FontAwesomeIcon).attrs({ icon: faCommentAltPlus })`
  font-size: ${({ height = 'inherit' }) => height};
`;
