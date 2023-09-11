'use client';

import {
  ReactionType,
  reactions as availableReactions,
} from '@/model/reaction';
import { useCallback, useState } from 'react';
import { Reaction } from '@prisma/client';
import { ReactionButton } from '@/components/composed/ReactionButton';
import { usePromise } from '@/util/usePromise';

async function updateReaction({
  postingId,
  selected,
  type,
}: {
  postingId: string;
  selected: boolean;
  type: ReactionType;
}) {
  const body = new FormData();
  body.append('type', type);

  const response = await fetch(`/api/posting/${postingId}/react`, {
    body,
    method: selected ? 'DELETE' : 'PUT',
  });

  if (!response.ok) {
    throw new Error('Could not create reaction');
  }
}

export function Reactions({
  postingId,
  reactions = [],
  userReactionType,
}: {
  postingId: string;
  reactions?: Reaction[];
  userReactionType?: string;
}) {
  const [cachedSelected, setCachedSelected] = useState(userReactionType);
  const { invoke, status } = usePromise(updateReaction);

  const reactionSummaries = availableReactions.map(({ icon, type }) => {
    const reactionsByType = reactions.filter(
      (reaction) => reaction.type === type,
    );

    const selected = cachedSelected === type;

    const statusSecondary = status === 'pending' ? 'pending' : 'standby';

    let countModifier = 0;

    if (selected) {
      countModifier += 1;
    }

    if (userReactionType === type) {
      countModifier -= 1;
    }

    return {
      count: reactionsByType.length + countModifier,
      icon,
      selected,
      status: selected ? status : statusSecondary,
      type,
    };
  });

  const onClick = useCallback(
    (clickedType: ReactionType) => {
      setCachedSelected(clickedType);
      invoke({
        postingId,
        selected: clickedType === cachedSelected,
        type: clickedType,
      });
    },
    [invoke, postingId, cachedSelected],
  );

  return (
    <div className="flex justify-center gap-5">
      {reactionSummaries.map(
        ({ count, icon, selected, status: thisStatus, type }) => (
          <ReactionButton
            count={count}
            icon={icon}
            key={type}
            onClick={onClick}
            selected={selected}
            status={thisStatus}
            type={type}
          />
        ),
      )}
    </div>
  );
}
