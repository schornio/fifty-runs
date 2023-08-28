import { z } from 'zod';

export const donationMultiplierSchema = z.object({
  donationMultiplier: z.enum(['nothing', 'x1', 'x2', 'x5', 'x10']),
});
