export function donationMultiplierToNumber(multiplier: string): number {
  switch (multiplier) {
    case 'x1':
      return 100;
    case 'x2':
      return 200;
    case 'x5':
      return 500;
    case 'x10':
      return 1000;
    default:
      return 0;
  }
}
