import { Box } from '@/components/atomics/Box';
import Link from 'next/link';
import { PostingImage } from '@/components/atomics/PostingImage';
import { Reaction } from '@prisma/client';
import { Reactions } from '@/components/composed/Reactions';
import { RunningExercise } from '@/components/composed/RunningExercise';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';

const { format } = new Intl.DateTimeFormat('de-de', {
  dateStyle: 'full',
  timeStyle: 'medium',
});

export function Posting({
  date,
  id,
  image,
  reactions,
  runningExercise,
  text,
  userImage,
  userName,
  userNameId,
  userReactionType,
}: {
  date: string;
  id: string;
  image?: string | null;
  reactions?: Reaction[];
  runningExercise?: {
    distanceInMeters: number;
    durationInSeconds: number;
  } | null;

  text?: string | null;
  userImage?: string | null;
  userName: string;
  userNameId: string;
  userReactionType?: string;
}) {
  return (
    <Box color="primary" roundedCorners={true} variant="outlined">
      <Box padding="double">
        <Stack alignInline="spaceBetween">
          <UserLabel
            userImage={userImage}
            userName={userName}
            userNameId={userNameId}
          />
          <Link href={`/postings/${id}`}>
            <Text color="text" fontSize="sub">
              {format(new Date(date))}
            </Text>
          </Link>
        </Stack>
      </Box>
      {image ? <PostingImage image={image} /> : undefined}
      {text && text.length > 0 ? (
        <Box textAlign="center" padding="double">
          {text}
        </Box>
      ) : undefined}
      {runningExercise ? (
        <Box padding="double">
          <RunningExercise {...runningExercise} />
        </Box>
      ) : undefined}
      <Box padding="double">
        <Reactions
          postingId={id}
          reactions={reactions}
          userReactionType={userReactionType}
        />
      </Box>
    </Box>
  );
}
