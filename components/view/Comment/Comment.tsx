'use client';

import { Box } from '@/components/atomics/Box';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';
import { useCallback } from 'react';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';

const { format } = new Intl.DateTimeFormat('de-de', {
  dateStyle: 'full',
  timeStyle: 'medium',
});

async function deleteComment(commentId: string) {
  const result = await fetch(`/api/comment/${commentId}`, {
    method: 'DELETE',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function Comment({
  date,
  id,
  ownComment,
  text,
  userImage,
  userName,
  userNameId,
}: {
  date: string;
  id: string;
  ownComment?: boolean;
  text: string;
  userImage?: string | null;
  userName: string;
  userNameId: string;
}) {
  const router = useRouter();
  const { invoke: invokeDeleteComment, status } = usePromise(deleteComment);

  const onClick = useCallback(async () => {
    const result = await invokeDeleteComment(id);
    if (result.status === 'resolved') {
      router.refresh();
    }
  }, [invokeDeleteComment, id, router]);

  return (
    <Box color="primary" roundedCorners={true} variant="outlined">
      <Box padding="normal">
        <Stack alignBlock="center">
          <UserLabel
            userImage={userImage}
            userName={userName}
            userNameId={userNameId}
          />
          <Box flexGrow={true} padding="normal">
            {text}
            <br />
            <Text fontSize="sub">{format(new Date(date))}</Text>
          </Box>
          {ownComment ? (
            <Text fontSize="sub">
              <ButtonAction
                color="error"
                contentPending="Löschen..."
                contentRejected="Löschen fehlgeschlagen"
                contentResolved="Gelöscht"
                contentStandby="Löschen"
                onClick={onClick}
                status={status}
                type="button"
              />
            </Text>
          ) : undefined}
        </Stack>
      </Box>
    </Box>
  );
}
