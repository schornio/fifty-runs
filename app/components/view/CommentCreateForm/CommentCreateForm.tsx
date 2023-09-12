'use client';

import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { commentSchema } from '@/schema/comment';
import { getPostingById } from '@/service/getPostingById';
import { useChat } from 'ai/react';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

type Posting = NonNullable<Awaited<ReturnType<typeof getPostingById>>>;

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

export function CommentCreateForm({ posting }: { posting: Posting }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const { setMessages, reload, messages } = useChat();
  const { errors, formRef, validateForm } = useValidation(commentSchema);
  const { invoke: invokeCreatePosting, status } = usePromise(createComment);

  const postingId = posting.id;
  const messageStart = `Das ist das Posting: ${JSON.stringify(posting)}`;

  const onTextChange = useCallback(
    (eventArgs: ChangeEvent<HTMLTextAreaElement>) => {
      setText(eventArgs.target.value);
    },
    [],
  );

  const onSelectGenerate = useCallback(
    (eventArgs: ChangeEvent<HTMLSelectElement>) => {
      switch (eventArgs.target.value) {
        case 'motivate':
          setMessages([
            {
              content: `${messageStart} - schreibe einen kurzen motivierenden Kommentar.`,
              id: '1',
              role: 'user',
            },
          ]);
          break;
        case 'challenge':
          setMessages([
            {
              content: `${messageStart} - schreibe einen kurzen herausfordernden Kommentar.`,
              id: '1',
              role: 'user',
            },
          ]);
          break;
        case 'support':
          setMessages([
            {
              content: `${messageStart} - schreibe einen kurzen unterstützenden Kommentar.`,
              id: '1',
              role: 'user',
            },
          ]);
          break;
      }

      reload();
    },
    [messageStart, setMessages, reload],
  );

  const lastMessage = messages.findLast(
    (message) => message.role === 'assistant',
  )?.content;

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
    [validateForm, invokeCreatePosting, postingId, formRef, router],
  );

  return (
    <form onSubmit={onSubmit} ref={formRef}>
      <div className="overflow-hidden rounded-xl border border-atlantis-500">
        <textarea
          className="min-h-[10rem] w-full p-4"
          name="text"
          onChange={onTextChange}
          placeholder="Schreibe ein Kommentar"
          value={lastMessage ?? text}
        />
        <div className="flex justify-end gap-2 bg-neutral-100 p-4">
          <select
            className="rounded-full border-2 border-congress-blue-900 p-2 text-xs md:text-base"
            onChange={onSelectGenerate}
            value=""
          >
            <option value="" disabled selected>
              Generieren 🤖
            </option>
            <option value="motivate">🤖 Motivierend</option>
            <option value="challenge">🤖 Herausfordernd</option>
            <option value="support">🤖 Unterstützend</option>
          </select>

          <ButtonAction
            contentPending="Kommentieren ..."
            contentRejected="Kommentieren fehlgeschlagen"
            contentResolved="Kommentiert"
            contentStandby="Kommentieren"
            status={status}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}
