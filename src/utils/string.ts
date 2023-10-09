/**
 * Converts a given string to kebab-case.
 * @param str - The string to be converted.
 */
export const toKebabCase = (str: string) =>
  str
    ?.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    )
    ?.map((x) => x.toLowerCase())
    ?.join('-') || str;

export const stringSubst = (str: string, vars: Record<string, string>) =>
  Object.keys(vars).reduce(
    (newStr, key) => newStr.replace(`%${key}`, vars[key]),
    str
  );
