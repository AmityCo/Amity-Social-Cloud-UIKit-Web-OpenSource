import React from 'react';
import styled from 'styled-components';

export default styled(props => <div {...props}>LIVE</div>)`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.palette.tertiary.main};
  border-radius: 0.25rem;
  color: #fff;
`;
