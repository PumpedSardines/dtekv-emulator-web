export function feqParser(feq: number) {
  if (feq >= 1e6) {
    return `${(feq / 1e6).toFixed(2)} MHz`;
  }
  if (feq >= 1e3) {
    return `${(feq / 1e3).toFixed(2)} kHz`;
  }
  return `${feq.toFixed(2)} Hz`;
}
