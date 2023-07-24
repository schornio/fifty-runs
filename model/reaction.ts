export const reactionTypes = ['fifty', 'like', 'love', 'wow', 'sad'] as const;

export type ReactionType = (typeof reactionTypes)[number];

export const reactions = [
  {
    icon: '💯',
    type: 'fifty',
  },
  {
    icon: '👍',
    type: 'like',
  },
  {
    icon: '❤️',
    type: 'love',
  },
  {
    icon: '😮',
    type: 'wow',
  },
  {
    icon: '😢',
    type: 'sad',
  },
] satisfies { type: ReactionType; icon: string }[];
