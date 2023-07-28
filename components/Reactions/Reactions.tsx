import Image from 'next/image';
import { ReactionButton } from '../ReactionButton';
import { Stack } from '@/components/atomics/Stack';
import { reactions as availableReactions } from '@/model/reaction';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';
import styles from './Reactions.module.css';

export async function Reactions({ postingId }: { postingId: string }) {
  const session = await getCurrentSession();
  const reactions = await prisma.reaction.findMany({
    include: {
      user: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    where: {
      postingId,
    },
  });

  const reactionSummaries = availableReactions.map(({ icon, type }) => {
    const reactionsByType = reactions.filter(
      (reaction) => reaction.type === type
    );
    return {
      count: reactionsByType.length,
      icon,
      reactionsByType,
      type,
    };
  });

  const userReaction = reactions.find(
    (reaction) => reaction.userId === session?.userId
  );

  return (
    <Stack alignInline="center" gap="normal">
      {reactionSummaries.map(({ count, icon, reactionsByType, type }) => (
        <ReactionButton
          exerciseId={postingId}
          key={type}
          selected={userReaction?.type === type}
          tooltip={
            count > 0 ? (
              <Stack gap="normal">
                {reactionsByType.map(({ user }) => (
                  <Stack alignBlock="center" key={user.id} gap="normal">
                    {user.image ? (
                      <Image
                        alt=""
                        className={styles['user-image']}
                        height={30}
                        src={user.image}
                        width={30}
                      />
                    ) : undefined}
                    {user.name}
                  </Stack>
                ))}
              </Stack>
            ) : undefined
          }
          type={type}
        >
          {icon} {count > 0 ? count : undefined}
        </ReactionButton>
      ))}
    </Stack>
  );
}
