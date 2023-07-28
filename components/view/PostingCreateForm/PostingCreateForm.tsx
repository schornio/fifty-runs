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
import { postingSchema } from '@/schema/posting';
import { runningExperciseSchema } from '@/schema/runningExercise';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';
import { z } from 'zod';

const requestSchema = z.union([postingSchema, runningExperciseSchema]);

const types = [
  {
    id: 'posting',
    label: 'Beitrag',
  },
  {
    id: 'runningExercise',
    label: 'Training',
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

async function createPosting(formData: FormData) {
  const result = await fetch('/api/posting', {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function PostingCreateForm() {
  const router = useRouter();
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(requestSchema);
  const { invoke: invokeCreatePosting, status } = usePromise(createPosting);
  const [formVisible, setFormVisible] = useState(false);
  const [type, setType] = useState('runningExercise');

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
        const result = await invokeCreatePosting(formData);

        if (result.status === 'resolved') {
          router.refresh();
          setFormVisible(false);
        }
      }
    },
    [validateForm, invokeCreatePosting, router]
  );

  if (!formVisible) {
    return (
      <Button onClick={onShowClick} type="button">
        Neuen Beitrag hinzufügen
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
          <Stack alignInline="center" gap="normal">
            <ButtonRadioGroup
              items={types}
              name="type"
              onChange={onTypeChange}
              value={type}
            />
          </Stack>
          <Box textAlign="center">
            {type === 'runningExercise' ? (
              <h2>Training hinzufügen</h2>
            ) : (
              <h2>Beitrag hinzufügen</h2>
            )}
          </Box>
          <Stack alignInline="center" direction="row">
            <InputImage
              error={errors}
              label="Bild hinzufügen"
              name="image"
              onChange={validateFormJustInTime}
              type="postImage"
            />
          </Stack>
          <Box textAlign="center">
            <h3>Distanz</h3>
          </Box>
          {type === 'runningExercise' ? (
            <>
              <Stack alignInline="center" direction="row" gap="normal">
                <InputText
                  error={errors}
                  label="Kilometer"
                  name="distanceKilometers"
                  onChange={validateFormJustInTime}
                  type="number"
                />
                <InputText
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
                  error={errors}
                  label="Stunden"
                  name="durationHours"
                  onChange={validateFormJustInTime}
                  type="number"
                />
                <InputText
                  error={errors}
                  label="Minuten"
                  name="durationMinutes"
                  onChange={validateFormJustInTime}
                  type="number"
                />
                <InputText
                  error={errors}
                  label="Sekunden"
                  name="durationSeconds"
                  onChange={validateFormJustInTime}
                  type="number"
                />
              </Stack>
            </>
          ) : undefined}
          <InputTextMultiline
            error={errors}
            label="Text"
            name="text"
            onChange={validateFormJustInTime}
          />
          <Stack alignInline="center" gap="normal">
            <ButtonRadioGroup
              defaultItemId="protected"
              items={visibilityItems}
              name="visibility"
            />
          </Stack>

          <ButtonAction
            contentPending="Hinzufügen..."
            contentRejected="Hinzufügen fehlgeschlagen"
            contentResolved="Hinzugefügt"
            contentStandby="Hinzufügen"
            status={status}
            type="submit"
          />
          <Button onClick={onHideClick} type="button" variant="text">
            Abbrechen
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
