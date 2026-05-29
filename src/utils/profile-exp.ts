export const EXP_PER_LEVEL = 36_000;

export function formatExp(exp: number): string {
  return new Intl.NumberFormat('en-US').format(Math.floor(exp));
}

export function getLevelFromExp(exp: number): number {
  if (exp <= 0) {
    return 1;
  }

  return Math.floor(exp / EXP_PER_LEVEL) + 1;
}

export function getLevelProgress(exp: number): number {
  if (exp <= 0) {
    return 0;
  }

  const expInCurrentLevel = exp % EXP_PER_LEVEL;
  return (expInCurrentLevel / EXP_PER_LEVEL) * 100;
}
