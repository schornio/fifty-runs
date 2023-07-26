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
import { Text } from '@/components/atomics/Text';
import { runningExperciseSchema } from '@/schema/runningExercise';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

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

async function createRunningExercise(formData: FormData) {
  const result = await fetch('/api/runningExercise', {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function RunningExerciseCreateForm() {
  const router = useRouter();
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(runningExperciseSchema);
  const { invoke: invokeCreateRunningExercise, status } = usePromise(
    createRunningExercise
  );
  const [formVisible, setFormVisible] = useState(false);

  const onShowClick = useCallback(() => {
    setFormVisible(true);
  }, []);

  const onHideClick = useCallback(() => {
    setFormVisible(false);
  }, []);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = validateForm();

      if (formData) {
        const result = await invokeCreateRunningExercise(formData);

        if (result.status === 'resolved') {
          router.refresh();
          setFormVisible(false);
        }
      }
    },
    [validateForm, invokeCreateRunningExercise, router]
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
          <Text textAlign="center">
            <h2>Training hinzufügen</h2>
          </Text>
          <Stack alignInline="center" direction="row">
            <InputImage
              error={errors}
              label="Bild hinzufügen"
              name="image"
              onChange={validateFormJustInTime}
              type="postImage"
            />
          </Stack>
          <Text textAlign="center">
            <h3>Distanz</h3>
          </Text>
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
          <Text textAlign="center">
            <h3>Dauer</h3>
          </Text>
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
          <InputTextMultiline
            error={errors}
            label="Notizen"
            name="notes"
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
