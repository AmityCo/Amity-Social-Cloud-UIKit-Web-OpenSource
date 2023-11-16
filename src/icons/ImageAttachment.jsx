import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/pro-light-svg-icons';

export default styled(FaIcon).attrs({ icon: faImage })`
  font-size: ${({ height = 'inherit' }) => height};
`;
