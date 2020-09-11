export const ConditionalRender = ({ condition, children }) => {
  return condition ? children : null;
};
