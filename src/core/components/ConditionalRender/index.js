export const ConditionalRender = ({ condition, children }) => {
  const [whenTrue, whenFalse] = children;
  return condition ? whenTrue : whenFalse || null;
};
