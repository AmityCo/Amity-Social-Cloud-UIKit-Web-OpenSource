export function stripUndefinedValues(obj) {
  const out = { ...obj };

  Object.entries(out).forEach(([key, value]) => {
    if (value === undefined) {
      delete out[key];
    }
  });

  return out;
}
