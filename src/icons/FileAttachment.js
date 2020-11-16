import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/pro-regular-svg-icons';

export default styled(FaIcon).attrs({ icon: faPaperclip })`
  font-size: ${({ height = 'inherit' }) => height};
`;
