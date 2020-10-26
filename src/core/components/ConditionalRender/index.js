const ConditionalRender = ({ condition, children }) => {
  const [whenTrue, whenFalse] = [].concat(children);
  return condition ? whenTrue : whenFalse || null;
};

export default ConditionalRender;
