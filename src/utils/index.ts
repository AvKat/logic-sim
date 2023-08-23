export const combineClassNames = (...classNames: string[]) => {
  return classNames.filter(Boolean).join(" ");
};

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const arrayRange = (length: number) => [...Array(length).keys()];
