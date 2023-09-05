'use client';

import {
  ButtonRadioGroup,
  ButtonRadioItem,
} from '@/components/composed/ButtonRadioGroup';
import { FormEvent, useCallback, useState } from 'react';
import { Button } from '@/components/atomics/Button';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { donationMultiplierSchema } from '@/schema/donationMultiplier';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

const multiplierItems: ButtonRadioItem[] = [
  {
    id: 'nothing',
    label: 'Keine Spende',
  },
  {
    id: 'x1',
    label: '1 €',
  },
  {
    id: 'x2',
    label: '2 €',
  },
  {
    id: 'x5',
    label: '5 €',
  },
  {
    id: 'x10',
    label: '10 €',
  },
];

async function changeDonationMultiplier(formData: FormData) {
  const result = await fetch('/api/user/changeDonationMultiplier', {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function DonationMultiplierSetForm({
  runDonationMultiplier,
}: {
  runDonationMultiplier?: string | null;
}) {
  const router = useRouter();
  const { formRef, validateForm } = useValidation(donationMultiplierSchema);
  const { invoke: invokeChangePassword, status } = usePromise(
    changeDonationMultiplier,
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
        const result = await invokeChangePassword(formData);

        if (result.status === 'resolved') {
          router.refresh();
        }
      }
    },
    [validateForm, invokeChangePassword, router],
  );

  if (!formVisible) {
    return (
      <Button
        className="bg-gold-500 text-black"
        onClick={onShowClick}
        type="button"
      >
        Spenden pro Lauf ändern
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-gold-500 p-4">
      <form onSubmit={onSubmit} ref={formRef}>
        <div className="flex flex-col gap-5">
          <h2 className="text-center text-xl">Geldspende pro Lauf</h2>

          <ButtonRadioGroup
            defaultItemId={runDonationMultiplier ?? 'nothing'}
            items={multiplierItems}
            name="donationMultiplier"
            variant="gold"
          />
          <ButtonAction
            contentPending="Spende ändern..."
            contentRejected="Spende ändern fehlgeschlagen"
            contentResolved="Spende ändern erfolgreich"
            contentStandby="Spende ändern"
            status={status}
            type="submit"
          />
          <Button onClick={onHideClick} type="button" variant="text">
            Abbrechen
          </Button>
        </div>
      </form>
    </div>
  );
}
