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

const { format: formatCurrency } = new Intl.NumberFormat('de-de', {
  currency: 'EUR',
  style: 'currency',
});

export function Posting({
  commentCount,
  date,
  donation,
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
  commentCount: number;
  date: string;
  donation?: {
    amountInCent: number;
  } | null;
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
    <Box
      color={donation ? 'gold' : 'primary'}
      roundedCorners={true}
      variant="outlined"
    >
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
      {donation ? (
        <Box padding="double" textAlign="center">
          <Text color="gold" fontWeight="bold" fontSize="heading1">
            {formatCurrency(donation.amountInCent / 100)}
          </Text>
          <br />
          Spende
        </Box>
      ) : undefined}
      <Box padding="normal">
        <Reactions
          postingId={id}
          reactions={reactions}
          userReactionType={userReactionType}
        />
      </Box>
      <Box padding="normal" textAlign="center">
        <Link href={`/postings/${id}`}>
          <Text color="primary" fontWeight="bold">
            Kommentare ({commentCount})
          </Text>
        </Link>
      </Box>
    </Box>
  );
}
