"use client";
import { Posting } from '@/components/view/Posting';
import { PostingResponse } from '@/model/posting/getPostings';
import { ReactNode, useState, useEffect } from 'react';
import { FiTrash, FiEdit, FiCalendar, FiCheck } from 'react-icons/fi';
import { FaRegCommentDots } from "react-icons/fa";
import Link from 'next/link';
import { deletePosting } from '@/components/view/PostingDeleteButton';
import { useRouter } from 'next/navigation';

export function Postings({
  contentAfter,
  contentBefore,
  postings = [],
  userId,
}: {
  contentAfter?: ReactNode;
  contentBefore?: ReactNode;
  postings?: PostingResponse;
  userId: string | undefined;
}) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [postingsState, setPostingsState] = useState(postings);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setPostingsState(postings);
  }, [postings]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDate(event.target.value);
  };

  const saveDateChange = async (id: string) => {
    if (!newDate) {
      console.error('Kein Datum eingegeben');
      return;
    }
    try {
      const response = await fetch(`/api/posting/${id}/updateDate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: newDate }),
      });

      if (response.ok) {
        const updatedPosting = await response.json();
        setPostingsState((prevPostings) =>
          prevPostings.map((post) =>
            post.id === id ? { ...post, date: new Date(updatedPosting.date) } : post
          )
        );
        setIsEditing(null);
      } else {
        console.error('Fehler beim Speichern des Datums');
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Datums', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePosting(id);
      setPostingsState((prevPostings) => prevPostings.filter((post) => post.id !== id));
      setShowConfirmModal(null);
      router.refresh();
    } catch (error) {
      console.error('Fehler beim Löschen des Beitrags', error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {contentBefore}
      {postingsState.map(({ _count, date, donation, id, image, reactions, runningExercise, text, user }) => (
        <div key={id} className="relative p-1">
          <Posting
            commentCount={_count.comments}
            date={new Date(date).toISOString()}
            donation={donation}
            runningExercise={runningExercise}
            id={id}
            image={image}
            reactions={reactions}
            text={text}
            userImage={user.image}
            userName={user.name}
            userNameId={user.nameId}
            userGroup={user.group?.name}
            userReactionType={reactions.find((reaction) => reaction.userId === userId)?.type}
          />
          {userId != user.id && (
            <div className="absolute top-4 right-4 flex gap-3 bg-white p-2">
              <Link href={`/postings/${id}`}>
              <FaRegCommentDots
                className="cursor-pointer text-congress-blue-900 hover:text-blue-700"
                title="Datum bearbeiten"
              />
               </Link>
            </div>
          )}
          {userId === user.id && (
            <div className="absolute top-4 right-4 flex gap-3 bg-white p-2">
              {isEditing === id ? (
                <>
                  <input
                    type="datetime-local"
                    value={newDate}
                    onChange={handleDateChange}
                    className="rounded border border-gray-300"
                  />
                  <FiCheck
                    className="cursor-pointer text-green-600"
                    onClick={() => saveDateChange(id)}
                    title="Änderung speichern"
                  />
                </>
              ) : (
                <FiCalendar
                  className="cursor-pointer text-congress-blue-900 hover:text-blue-700"
                  title="Datum bearbeiten"
                  onClick={() => {
                    setIsEditing(id);
                    setNewDate(new Date(date).toISOString().slice(0, 16));
                  }}
                />
              )}
              <Link href={`/postings/${id}`}>
                <FiEdit className="cursor-pointer text-congress-blue-900 hover:text-blue-700 transition-colors" title="Post bearbeiten" />
              </Link>
              <FiTrash
                className="cursor-pointer text-red-600 hover:text-red-400 transition-colors"
                title="Post löschen"
                onClick={() => setShowConfirmModal(id)}
              />
            </div>
          )}
        </div>
      ))}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="z-50 rounded-lg bg-white p-4 shadow-lg">
            <p className="mb-4 text-center">Bist du sicher, dass du diesen Beitrag löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <div className="flex justify-center gap-4">
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-white"
                onClick={() => handleDelete(showConfirmModal)}
              >
                Löschen
              </button>
              <button
                className="rounded-md bg-gray-300 px-4 py-2 text-black"
                onClick={() => setShowConfirmModal(null)}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
      {contentAfter}
    </div>
  );
}