'use client';

import { FormEvent, useCallback, useState } from 'react';
import { Box } from '@/components/view/Box';
import { ButtonAction } from '@/components/view/ButtonAction';
import { InputImage } from '@/components/view/InputImage';
import { InputText } from '@/components/view/InputText';
import { InputTextMultiline } from '@/components/view/InputTextMultiline';
import { RadioGroup } from '../view/RadioGroup';
import { Stack } from '@/components/view/Stack';
import { Typography } from '@/components/view/Typography';
import { runningExperciseSchema } from '@/schema/runningExercise';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';
import { Button } from '../view/Button';

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
      color="accent1"
      corner="1"
      padding="2"
      maxWidth="phone"
      variant="outline"
    >
      <form onSubmit={onSubmit} ref={formRef}>
        <Stack alignBlock="stretch" gap="1">
          <Typography align="center">
            <h2>Training hinzufügen</h2>
          </Typography>
          <Stack alignInline="center" direction="horizontal">
            <InputImage
              height={300}
              label="Bild hinzufügen"
              name="image"
              onChange={validateFormJustInTime}
              width={600}
            />
          </Stack>
          <Typography align="center">
            <h3>Distanz</h3>
          </Typography>
          <Stack alignInline="center" direction="horizontal" gap="1">
            <InputText
              error={errors}
              label="Kilometer"
              name="distanceKilometers"
              onChange={validateFormJustInTime}
              type="text"
            />
            <InputText
              error={errors}
              label="Meter"
              name="distanceMeters"
              onChange={validateFormJustInTime}
              type="text"
            />
          </Stack>
          <Typography align="center">
            <h3>Dauer</h3>
          </Typography>
          <Stack alignInline="center" direction="horizontal" gap="1">
            <InputText
              error={errors}
              label="Stunden"
              name="durationHours"
              onChange={validateFormJustInTime}
              type="text"
            />
            <InputText
              error={errors}
              label="Minuten"
              name="durationMinutes"
              onChange={validateFormJustInTime}
              type="text"
            />
            <InputText
              error={errors}
              label="Sekunden"
              name="durationSeconds"
              onChange={validateFormJustInTime}
              type="text"
            />
          </Stack>
          <InputTextMultiline
            error={errors}
            label="Notizen"
            name="notes"
            onChange={validateFormJustInTime}
          />
          <RadioGroup
            defaultItemId="protected"
            items={visibilityItems}
            name="visibility"
          />

          <ButtonAction
            contentPending="Hinzufügen..."
            contentRejected="Hinzufügen fehlgeschlagen"
            contentResolved="Hinzugefügt"
            contentStandby="Hinzufügen"
            status={status}
          />
          <Button onClick={onHideClick} type="button" variant="text">
            Abbrechen
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
