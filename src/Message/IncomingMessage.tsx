import React from 'react';
import Message from './index';
import { customizableComponent } from '../hoks/customization';

const IncomingMessage = props => <Message incoming {...props} />;

export default customizableComponent('IncomingMessage')(IncomingMessage);
