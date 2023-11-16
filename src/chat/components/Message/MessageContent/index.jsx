import React from 'react';
import { MessageType } from '@amityco/js-sdk';

import Deleted from './Deleted';
import Text from './Text';
import Custom from './Custom';
import Unsupported from './Unsupported';

const RENDERERS = {
  [MessageType.Text]: Text,
  [MessageType.Custom]: Custom,
};

const MessageContent = ({ data, type, isDeleted }) => {
  if (isDeleted) {
    return <Deleted />;
  }

  const Renderer = RENDERERS[type] ?? Unsupported;

  return <Renderer data={data} />;
};

export default MessageContent;
