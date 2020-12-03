import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';

export default styled(FaIcon).attrs({ icon: faSearch })`
  font-size: ${({ height = 'inherit' }) => height};
`;
