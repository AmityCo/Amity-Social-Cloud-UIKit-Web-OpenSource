import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/pro-solid-svg-icons';
import { ReactNode } from 'react';

export default styled(FontAwesomeIcon).attrs<{ icon?: ReactNode }>({ icon: faSortDown })`
  font-size: ${({ height = 'inherit' }) => height};
`;
