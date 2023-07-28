import { Reaction } from '@prisma/client';
import { ReactionButton } from '../ReactionButton';
import { Stack } from '@/components/atomics/Stack';
import { reactions as availableReactions } from '@/model/reaction';

export function Reactions({
  postingId,
  reactions = [],
  userReactionType,
}: {
  postingId: string;
  reactions?: Reaction[];
  userReactionType?: string;
}) {
  const reactionSummaries = availableReactions.map(({ icon, type }) => {
    const reactionsByType = reactions.filter(
      (reaction) => reaction.type === type
    );
    return {
      count: reactionsByType.length,
      icon,
      type,
    };
  });

  return (
    <Stack alignInline="center" gap="normal">
      {reactionSummaries.map(({ count, icon, type }) => (
        <ReactionButton
          count={count}
          icon={icon}
          key={type}
          postingId={postingId}
          selected={userReactionType === type}
          type={type}
        />
      ))}
    </Stack>
  );
}
