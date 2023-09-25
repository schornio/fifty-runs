import { Hero } from '@/types/content/Hero';
import { HorizontalRuler } from '@/types/content/HorizontalRuler';
import { Leaderboard } from '@/types/content/Leaderboard';
import { TestimonialCollection } from './TestimonialCollection';
import { Text } from '@/types/content/Text';

export type Content =
  | Hero
  | HorizontalRuler
  | Leaderboard
  | TestimonialCollection
  | Text;
