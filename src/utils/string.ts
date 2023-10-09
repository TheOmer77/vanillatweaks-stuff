/**
 * Convert a given string to kebab-case.
 * @param str - The string to be converted.
 */
export const toKebabCase = (str: string) =>
  str
    ?.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    )
    ?.map((x) => x.toLowerCase())
    ?.join('-') || str;

/**
 * Modify a given string with variable placeholders (`%variable`s), replacing
 * the placeholders with values.
 *
 * @param str The original string with `%variable`s.
 * @param vars Values of variables to insert into the string.
 * @returns The modified string, with values replacing the placeholders.
 */
export const stringSubst = (str: string, vars: Record<string, string>) =>
  Object.keys(vars).reduce(
    (newStr, key) => newStr.replace(`%${key}`, vars[key]),
    str
  );
