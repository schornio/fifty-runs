'use client';

import { ButtonAction } from '@/components/composed/ButtonAction';
import { UserLabel } from '@/components/composed/UserLabel';
import { useCallback } from 'react';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';

const { format } = new Intl.DateTimeFormat('de-de', {
  dateStyle: 'medium',
  timeStyle: 'short',
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
    <div className="overflow-hidden rounded-xl border border-congress-blue-900">
      <div className="flex items-center justify-between border-b border-congress-blue-900 p-2">
        <UserLabel
          userImage={userImage}
          userName={userName}
          userNameId={userNameId}
        />
        <div className="text-xs">{format(new Date(date))}</div>
      </div>
      <div className="p-4">
        {text}
        <br />
      </div>
      {ownComment ? (
        <div className="flex justify-end bg-neutral-100 p-4 text-xs">
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
        </div>
      ) : undefined}
    </div>
  );
}
