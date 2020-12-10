const toArray = value => {
  return Array.isArray(value) ? value : [value];
};

export default toArray;
