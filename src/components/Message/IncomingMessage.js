import React from 'react';
import Message from '.';
import { customizableComponent } from '../../hocs/customization';

const IncomingMessage = props => <Message incoming {...props} />;

export default customizableComponent('IncomingMessage')(IncomingMessage);
