export const uniqueId = (prefix?: string) =>
  prefix + '-' + Date.now() + Math.random().toString(36).substring(2, 9);
