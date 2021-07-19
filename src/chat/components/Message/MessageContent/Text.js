import React from 'react';

import Linkify from '~/core/components/Linkify';

const Text = ({ data }) => {
  return <Linkify>{data.text}</Linkify>;
};

export default Text;
