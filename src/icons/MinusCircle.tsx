import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/pro-regular-svg-icons';
import { ReactNode } from 'react';

export default styled(FontAwesomeIcon).attrs<{ icon?: ReactNode }>({ icon: faMinusCircle })`
  font-size: ${({ height = 'inherit' }) => height};
`;
