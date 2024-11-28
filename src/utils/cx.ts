function cx(...args: (null | undefined | string | false)[]): string {
  return args
    .filter((arg): arg is NonNullable<typeof arg> => !!arg)
    .map((arg) => arg)
    .join(" ");
}

export default cx;
