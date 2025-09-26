import React from 'react';

const Custom = ({ data }: { data: unknown }) => {
  return <pre>{JSON.stringify(data)}</pre>;
};

export default Custom;
