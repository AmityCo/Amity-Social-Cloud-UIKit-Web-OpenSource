import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faLockAlt } from '@fortawesome/pro-regular-svg-icons';

export default styled(FaIcon).attrs({ icon: faLockAlt })`
  font-size: ${({ height = 'inherit' }) => height};
`;
