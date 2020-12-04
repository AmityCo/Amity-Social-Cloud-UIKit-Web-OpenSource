import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/pro-regular-svg-icons';

export default styled(FaIcon).attrs({ icon: faCamera })`
  font-size: "${({ height = 'inherit' }) => height}";
`;
