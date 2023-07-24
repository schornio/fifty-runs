"use client";

import { RunningExercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback } from "react";

function RunningExerciseListItem({ exercise }: { exercise: RunningExercise }) {
  const { refresh } = useRouter();
  const onDeleteClick = useCallback(async () => {
    await fetch(`/api/runningExercise/${exercise.id}`, {
      method: "DELETE",
    });
    refresh();
  }, [exercise.id, refresh]);

  return (
    <li>
      {exercise.distanceInMeter} Meter{" "}
      {new Intl.RelativeTimeFormat("de", {
        style: "long",
        numeric: "auto",
      }).format(exercise.durationInSeconds, "second")}{" "}
      am{" "}
      {Intl.DateTimeFormat("de", {
        dateStyle: "full",
        timeStyle: "medium",
      }).format(exercise.date)}{" "}
      <em>{exercise.note}</em>
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
