import { Metadata } from 'next';
import { Visibility } from '@prisma/client';
import { cache } from 'react';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

const getPostingById = cache(async (id: string, userId?: string) => {
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

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const session = await getCurrentSession();
  const posting = await getPostingById(id, session?.userId);

  if (!posting) {
    return {};
  }

  const images = posting.image ? [{ url: posting.image }] : [];

  return {
    openGraph: {
      description: posting.text ?? undefined,
      images,
    },
  };
}

export default async function PostingByIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getCurrentSession();
  const posting = await getPostingById(id, session?.userId);

  return (
    <>
      <pre>{JSON.stringify(posting, null, ' ')}</pre>
    </>
  );
}
