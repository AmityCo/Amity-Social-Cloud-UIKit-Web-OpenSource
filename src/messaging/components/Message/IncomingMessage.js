import React from 'react';
import customizableComponent from '~/core/hocs/customization';
import Message from '.';

const IncomingMessage = props => <Message incoming {...props} />;

export default customizableComponent('IncomingMessage', IncomingMessage);
