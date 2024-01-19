import React from 'react';

import Linkify from '~/core/components/Linkify';

const Text = ({ data }: { data: { text: string } }) => {
  return <Linkify>{data.text}</Linkify>;
};

export default Text;
