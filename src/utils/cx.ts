function cx(...args: any[]): string {
  return args
    .filter((arg) => arg)
    .map((arg) => (typeof arg === 'string' ? arg : Object.keys(arg).filter((key) => arg[key])))
    .flat(Infinity)
    .join(' ');
}

export default cx;
