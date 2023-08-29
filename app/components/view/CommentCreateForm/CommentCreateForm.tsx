'use client';

import { FormEvent, useCallback } from 'react';
import { Box } from '@/components/atomics/Box';
import { Button } from '@/components/atomics/Button';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { InputTextMultiline } from '@/components/atomics/InputTextMultiline';
import { Stack } from '@/components/atomics/Stack';
import { commentSchema } from '@/schema/comment';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

async function createComment({
  formData,
  postingId,
}: {
  formData: FormData;
  postingId: string;
}) {
  const result = await fetch(`/api/posting/${postingId}/comment`, {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function CommentCreateForm({ postingId }: { postingId: string }) {
  const router = useRouter();
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(commentSchema);
  const { invoke: invokeCreatePosting, status } = usePromise(createComment);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = validateForm();

      if (formData) {
        const result = await invokeCreatePosting({ formData, postingId });

        if (result.status === 'resolved') {
          formRef.current?.reset();
          router.refresh();
        }
      }
    },
    [validateForm, invokeCreatePosting, postingId, formRef, router]
  );

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
          <InputTextMultiline
            error={errors}
            label="Kommentar"
            name="text"
            onChange={validateFormJustInTime}
          />
          <ButtonAction
            contentPending="Kommentieren ..."
            contentRejected="Kommentieren fehlgeschlagen"
            contentResolved="Kommentiert"
            contentStandby="Kommentieren"
            status={status}
            type="submit"
          />
          <Button type="reset" variant="text">
            Abbrechen
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
