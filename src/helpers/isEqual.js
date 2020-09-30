export const isEqual = (a, b) => {
  if (typeof a === 'object' && typeof b === 'object') {
    return Object.entries(a).toString() === Object.entries(b).toString();
  }

  return a === b;
};
