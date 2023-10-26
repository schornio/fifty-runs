'use client';

import { FormEvent, useCallback, useState } from 'react';
import { Box } from '@/components/atomics/Box';
import { Button } from '@/components/atomics/Button';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { ButtonRadioGroup } from '@/components/composed/ButtonRadioGroup';
import { InputImage } from '@/components/atomics/InputImage';
import { InputText } from '@/components/atomics/InputText';
import { InputTextMultiline } from '@/components/atomics/InputTextMultiline';
import { Stack } from '@/components/atomics/Stack';
import { donationSchema } from '@/schema/donation';
import { postingSchema } from '@/schema/posting';
import { runningExperciseSchema } from '@/schema/runningExercise';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';
import { z } from 'zod';

const requestSchema = z.union([
  postingSchema,
  runningExperciseSchema,
  donationSchema,
]);

const types = [
  {
    id: 'posting',
    label: 'Beitrag',
  },
  {
    id: 'runningExercise',
    label: 'Training',
  },
  {
    id: 'donation',
    label: 'Spende',
  },
];

const visibilityItems = [
  {
    id: 'public',
    label: 'Öffentlich',
  },
  {
    id: 'protected',
    label: 'Benutzer*innen',
  },
  {
    id: 'private',
    label: 'Privat',
  },
];

async function upsertPosting({
  formData,
  postingId,
}: {
  formData: FormData;
  postingId?: string;
}) {
  if (postingId) {
    const result = await fetch(`/api/posting/${postingId}`, {
      body: formData,
      method: 'PUT',
    });
    if (!result.ok) {
      throw new Error();
    }
  } else {
    const result = await fetch('/api/posting', {
      body: formData,
      method: 'POST',
    });
    if (!result.ok) {
      throw new Error();
    }
  }
}

export function PostingForm({
  editPostingId,
  postingType,
  ...posting
}: {
  donationAmountCent?: number;
  editPostingId?: string;
  exerciseDistanceMeters?: number;
  exerciseDurationSeconds?: number;
  postingType?: string;
  text?: string;
}) {
  const mode = editPostingId ? 'edit' : 'create';

  const defaultDonationAmountCent = posting.donationAmountCent
    ? posting.donationAmountCent % 1000
    : undefined;
  const defaultDonationAmountEuro = posting.donationAmountCent
    ? Math.floor(posting.donationAmountCent / 1000)
    : undefined;
  const defaultExerciseDistanceMeters = posting.exerciseDistanceMeters
    ? posting.exerciseDistanceMeters % 1000
    : undefined;
  const defaultExerciseDistanceKilometers = posting.exerciseDistanceMeters
    ? Math.floor(posting.exerciseDistanceMeters / 1000)
    : undefined;
  const defaultExerciseDurationSeconds = posting.exerciseDurationSeconds
    ? posting.exerciseDurationSeconds % 60
    : undefined;
  const defaultExerciseDurationMinutes = posting.exerciseDurationSeconds
    ? Math.floor(posting.exerciseDurationSeconds / 60) % 60
    : undefined;
  const defaultExerciseDurationHours = posting.exerciseDurationSeconds
    ? Math.floor(posting.exerciseDurationSeconds / 3600)
    : undefined;

  const router = useRouter();
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(requestSchema);
  const { invoke: invokeUpsertPosting, status } = usePromise(upsertPosting);
  const [formVisible, setFormVisible] = useState(false);
  const [type, setType] = useState(postingType ?? 'runningExercise');

  const onShowClick = useCallback(() => {
    setFormVisible(true);
  }, []);

  const onHideClick = useCallback(() => {
    setFormVisible(false);
  }, []);

  const onTypeChange = useCallback((newType: string) => {
    setType(newType);
  }, []);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = validateForm();

      if (formData) {
        const result = await invokeUpsertPosting({
          formData,
          postingId: editPostingId,
        });

        if (result.status === 'resolved') {
          router.refresh();
          setFormVisible(false);
        }
      }
    },
    [validateForm, invokeUpsertPosting, editPostingId, router],
  );

  if (!formVisible) {
    return (
      <Button onClick={onShowClick} type="button">
        {mode === 'create' ? 'Neuen Beitrag hinzufügen' : undefined}
        {mode === 'edit' ? 'Beitrag bearbeiten' : undefined}
      </Button>
    );
  }

  return (
    <Box
      color="secondary"
      maxWidth="mobile"
      padding="normal"
      roundedCorners={true}
      variant="outlined"
    >
      <form onSubmit={onSubmit} ref={formRef}>
        <Stack alignBlock="stretch" direction="column" gap="normal">
          {mode === 'create' ? (
            <Stack alignInline="center" gap="normal">
              <ButtonRadioGroup
                items={types}
                name="type"
                onChange={onTypeChange}
                value={type}
              />
            </Stack>
          ) : undefined}
          {mode === 'edit' ? (
            <input name="type" type="hidden" value={postingType} />
          ) : undefined}

          <Box textAlign="center">
            {type === 'runningExercise' ? (
              <h2>
                {mode === 'create' ? 'Training hinzufügen' : undefined}
                {mode === 'edit' ? 'Training bearbeiten' : undefined}
              </h2>
            ) : undefined}
            {type === 'posting' ? (
              <h2>
                {mode === 'create' ? 'Beitrag hinzufügen' : undefined}
                {mode === 'edit' ? 'Beitrag bearbeiten' : undefined}
              </h2>
            ) : undefined}
            {type === 'donation' ? (
              <h2>
                {mode === 'create' ? 'Spende hinzufügen' : undefined}
                {mode === 'edit' ? 'Spende bearbeiten' : undefined}
              </h2>
            ) : undefined}
          </Box>
          {mode === 'create' ? (
            <Stack alignInline="center" direction="row">
              <InputImage
                error={errors}
                label={
                  mode === 'create'
                    ? 'Bild hinzufügen'
                    : mode === 'edit'
                    ? 'Bild ändern'
                    : undefined
                }
                name="image"
                onChange={validateFormJustInTime}
                type="postingImage"
              />
            </Stack>
          ) : undefined}

          {type === 'runningExercise' ? (
            <>
              <Box textAlign="center">
                <h3>Distanz</h3>
              </Box>
              <Stack alignInline="center" direction="row" gap="normal">
                <InputText
                  defaultValue={defaultExerciseDistanceKilometers?.toString()}
                  error={errors}
                  label="Kilometer"
                  name="distanceKilometers"
                  onChange={validateFormJustInTime}
                  type="number"
                />
                <InputText
                  defaultValue={defaultExerciseDistanceMeters?.toString()}
                  error={errors}
                  label="Meter"
                  name="distanceMeters"
                  onChange={validateFormJustInTime}
                  type="number"
                />
              </Stack>
              <Box textAlign="center">
                <h3>Dauer</h3>
              </Box>
              <Stack alignInline="center" direction="row" gap="normal">
                <InputText
                  defaultValue={defaultExerciseDurationHours?.toString()}
                  error={errors}
                  label="Stunden"
                  name="durationHours"
                  onChange={validateFormJustInTime}
                  type="number"
                />
                <InputText
                  defaultValue={defaultExerciseDurationMinutes?.toString()}
                  error={errors}
                  label="Minuten"
                  name="durationMinutes"
                  onChange={validateFormJustInTime}
                  type="number"
                />
                <InputText
                  defaultValue={defaultExerciseDurationSeconds?.toString()}
                  error={errors}
                  label="Sekunden"
                  name="durationSeconds"
                  onChange={validateFormJustInTime}
                  type="number"
                />
              </Stack>
            </>
          ) : undefined}
          {type === 'donation' ? (
            <>
              <Box textAlign="center">
                <h3>Spende</h3>
              </Box>
              <Stack alignInline="center" direction="row" gap="normal">
                <InputText
                  defaultValue={defaultDonationAmountEuro?.toString()}
                  error={errors}
                  label="Euro"
                  name="amountEuro"
                  onChange={validateFormJustInTime}
                  type="number"
                />
                <InputText
                  defaultValue={defaultDonationAmountCent?.toString()}
                  error={errors}
                  label="Cent"
                  name="amountCent"
                  onChange={validateFormJustInTime}
                  type="number"
                />
              </Stack>
            </>
          ) : undefined}
          <InputTextMultiline
            defaultValue={posting?.text}
            error={errors}
            label="Text"
            name="text"
            onChange={validateFormJustInTime}
          />
          <Stack alignInline="center" directionOnMobile="column" gap="normal">
            <ButtonRadioGroup
              color="secondary"
              defaultItemId="protected"
              items={visibilityItems}
              name="visibility"
              variant="secondary"
            />
          </Stack>

          {mode === 'create' ? (
            <ButtonAction
              contentPending="Hinzufügen..."
              contentRejected="Hinzufügen fehlgeschlagen"
              contentResolved="Hinzugefügt"
              contentStandby="Hinzufügen"
              status={status}
              type="submit"
            />
          ) : undefined}

          {mode === 'edit' ? (
            <ButtonAction
              contentPending="Ändern..."
              contentRejected="Ändern fehlgeschlagen"
              contentResolved="Geändert"
              contentStandby="Ändern"
              status={status}
              type="submit"
            />
          ) : undefined}

          <Button onClick={onHideClick} type="button" variant="text">
            Abbrechen
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
