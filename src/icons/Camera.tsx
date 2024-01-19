import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/pro-regular-svg-icons';
import { ReactNode } from 'react';

export default styled(FaIcon).attrs<{ icon?: ReactNode }>({ icon: faCamera })`
  font-size: '${({ height = 'inherit' }) => height}';
`;
