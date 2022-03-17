const isEmpty = (...values) => {
  const isEmptyValue = (value) => {
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }

    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    return !!value;
  };

  return values.every(isEmptyValue);
};

export default isEmpty;
