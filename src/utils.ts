export const snakeToCamelCase = (str: String) =>
  str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));
