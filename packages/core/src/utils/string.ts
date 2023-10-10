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
 * Strip out HTML tags from a string.
 * @param str The original string.
 */
export const removeHtmlTags = (str: string) =>
  typeof str === 'string' ? str.replace(/(<([^>]+)>)/gi, '') : str;

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

/**
 * Modify an array of strings to be the same length as the longest string in
 * the array, by padding them.
 * @param strings The original strings
 * @param padChar Character used for padding strings.
 */
export const equalLengthStrings = (strings: string[], padChar = ' ') => {
  const longestLength = strings.toSorted((a, b) =>
    a.length < b.length ? 1 : a.length > b.length ? -1 : 0
  )[0].length;
  return strings.map((str) =>
    [str, ...[...Array(longestLength - str.length)].map(() => padChar)].join('')
  );
};
