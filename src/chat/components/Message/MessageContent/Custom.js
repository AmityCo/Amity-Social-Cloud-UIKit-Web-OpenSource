import React from 'react';

const Custom = ({ data }) => {
  return <pre>{JSON.stringify(data)}</pre>;
};

export default Custom;
