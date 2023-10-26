import { ZodIssue, ZodType } from 'zod';
import { useCallback, useMemo, useRef, useState } from 'react';

export function useValidation(schema: { safeParse: ZodType['safeParse'] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [justInTimeValidation, setJustInTimeValidation] = useState(false);
  const [errorState, setErrorState] = useState<ZodIssue[] | undefined>(
    undefined,
  );

  const validateForm = useCallback(() => {
    const formData = new FormData(formRef.current ?? undefined);
    const entities = Object.fromEntries(formData.entries());
    const result = schema.safeParse(entities);
    if (result.success) {
      setErrorState(undefined);
      setJustInTimeValidation(false);
      return formData;
    } else {
      setErrorState(result.error.issues);
      setJustInTimeValidation(true);
    }
    return undefined;
  }, [schema]);

  const validateFormJustInTime = useCallback(() => {
    if (justInTimeValidation) {
      validateForm();
    }
  }, [justInTimeValidation, validateForm]);

  const errors = useMemo(() => {
    if (!errorState) {
      return undefined;
    }

    const currentErrors = new Map<string, string[]>();
    for (const currentError of errorState) {
      const path = currentError.path.join('.');
      const messages = currentErrors.get(path) ?? [];
      messages.push(currentError.message);
      currentErrors.set(path, messages);
    }
    return currentErrors;
  }, [errorState]);

  return {
    errors,
    formRef,
    validateForm,
    validateFormJustInTime,
  };
}
