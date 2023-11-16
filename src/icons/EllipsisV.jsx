import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/pro-solid-svg-icons';

export default styled(FaIcon).attrs({ icon: faEllipsisV })`
  font-size: ${({ height = 'inherit' }) => height};
`;
