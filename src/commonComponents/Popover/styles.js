import React from 'react';
import styled from 'styled-components';
import ReactTinyPopover from 'react-tiny-popover';

const ReactPopover = props => <ReactTinyPopover containerClassName={props.className} {...props} />;

export const Popover = styled(ReactPopover)`
  ${({ theme }) => theme.typography.body}
  z-index: 10000;
  background: white;
  min-width: 200px;
  padding: 4px 0;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;
