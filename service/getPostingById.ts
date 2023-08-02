import { Visibility } from '@prisma/client';
import { cache } from 'react';
import { prisma } from '@/prisma';

export const getPostingById = cache(async (id: string, userId?: string) => {
  const visibility: Visibility[] = userId
    ? ['public']
    : ['public', 'protected'];

  const ownPostingsQuery = userId ? [{ userId }] : [];

  return await prisma.posting.findUnique({
    include: {
      comments: {
        include: {
          user: {
            select: {
              image: true,
              name: true,
              nameId: true,
            },
          },
        },
      },
      reactions: {
        include: {
          user: {
            select: {
              image: true,
              name: true,
              nameId: true,
            },
          },
        },
      },
      runningExercise: true,
      user: {
        select: {
          image: true,
          name: true,
          nameId: true,
        },
      },
    },
    where: {
      OR: [{ visibility: { in: visibility } }, ...ownPostingsQuery],
      id,
    },
  });
});
