import {
  ReactionType,
  reactions as availableReactions,
} from '@/model/reaction';
import { Box } from '../view/Box';
import Image from 'next/image';
import { Stack } from '../view/Stack';
import { Typography } from '../view/Typography';
import { prisma } from '@/prisma';
import { ReactionButton } from '../ReactionButton';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import styles from './Reactions.module.css';

export async function Reactions({ exerciseId }: { exerciseId: string }) {
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
      exerciseId,
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
    <Stack alignInline="center" direction="horizontal" gap="1">
      {reactionSummaries.map(({ count, icon, reactionsByType, type }) => (
        <ReactionButton
          exerciseId={exerciseId}
          key={type}
          selected={userReaction?.type === type}
          tooltip={
            count > 0 ? (
              <Stack gap="1">
                {reactionsByType.map(({ user }) => (
                  <Stack
                    alignBlock="center"
                    direction="horizontal"
                    key={user.id}
                    gap="1"
                  >
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
