'use client';
import Image from 'next/image';
import { RunningExercise } from '@prisma/client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

function RunningExerciseListItem({ exercise }: { exercise: RunningExercise }) {
  const { refresh } = useRouter();
  const onDeleteClick = useCallback(async () => {
    await fetch(`/api/runningExercise/${exercise.id}`, {
      method: 'DELETE',
    });
    refresh();
  }, [exercise.id, refresh]);

  return (
    <li>
      {exercise.distanceInMeters} Meter{' '}
      {new Intl.RelativeTimeFormat('de', {
        numeric: 'auto',
        style: 'long',
      }).format(exercise.durationInSeconds, 'second')}{' '}
      am{' '}
      {Intl.DateTimeFormat('de', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(exercise.date)}{' '}
      <em>{exercise.notes}</em>
      {exercise.image ? (
        <Image src={exercise.image} alt="" width={100} height={100} />
      ) : null}
      <button onClick={onDeleteClick}>Löschen</button>
    </li>
  );
}

export function RunningExerciseList({
  exercises,
}: {
  exercises: RunningExercise[];
}) {
  return (
    <ol reversed={true}>
      {exercises.map((exercise) => (
        <RunningExerciseListItem exercise={exercise} key={exercise.id} />
      ))}
    </ol>
  );
}
