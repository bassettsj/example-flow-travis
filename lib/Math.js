/** @flow */
export function sum(...numbers: Array<number>): number {
  return numbers.reduce((sum: number, n: number): number => sum + n, 0);
}
