import { reactionTypes } from '@/model/reaction';
import { z } from 'zod';

export const createReactionSchema = z.object({
  type: z.enum(reactionTypes),
});
