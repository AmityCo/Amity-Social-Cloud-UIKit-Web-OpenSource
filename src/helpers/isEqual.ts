/**
 * @deprecated
 */
const isEqual = (a: any, b: any) => {
  if (typeof a === 'object' && typeof b === 'object') {
    return Object.entries(a).toString() === Object.entries(b).toString();
  }

  return a === b;
};

export default isEqual;
