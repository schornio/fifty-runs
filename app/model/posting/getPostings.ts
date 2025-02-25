import { Prisma, Session, Visibility } from '@prisma/client';
import { prisma } from '@/prisma';

type JSONParsed<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<JSONParsed<U>>
  : T extends object
  ? { [K in keyof T]: JSONParsed<T[K]> }
  : T;

const season = process.env.SEASON;

const selectPosting = {
  _count: {
    select: {
      comments: true,
    },
  },
  date: true,
  donation: true,
  id: true,
  image: true,
  reactions: true,
  runningExercise: true,
  text: true,
  user: {
    select: {
      id: true,
      image: true,
      name: true,
      nameId: true,
      group: {
        select: {
          name: true,
        }
      },
    },
  },
  
};

export type PostingResponse = Prisma.PostingGetPayload<{
  select: typeof selectPosting;
}>[];

export type PostingResponseParsed = JSONParsed<PostingResponse>;

export async function getPostings(args?: {
  byUserId?: string;
  from?: string | Date;
  session?: Session | null;
  take?: number;
}) {
  const { from, session } = args ?? {};

  const visibility: Visibility[] = session
    ? ['public', 'protected']
    : ['public'];

  const ownPostingsQuery = session
    ? [
        {
          userId: session.userId,
        },
      ]
    : [];

  const postings = await prisma.posting.findMany({
    orderBy: {
      date: 'desc',
    },
    select: selectPosting,
    take: args?.take ?? 5,
    where: {
      OR: [
        {
          visibility: {
            in: visibility,
          },
        },
        ...ownPostingsQuery,
      ],
      date: {
        lt: from ? new Date(from) : new Date(),
      },
      season,
      userId: args?.byUserId,
    },
  });

  return postings;
}
