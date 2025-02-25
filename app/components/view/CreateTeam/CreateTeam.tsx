'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atomics/Button/Button';
import { Stack } from '@/components/atomics/Stack/Stack';

interface CreateTeamProps {
  user: {
    id: string;
    group?: unknown;
  };
}

export function CreateTeam({}: CreateTeamProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Team konnte nicht erstellt werden');
      } else {
        // Erfolgreich erstellt – leite zur Teamseite weiter
        router.push(`/team/${data.nameId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      { !showForm ? (
        <Stack direction="column" alignBlock="stretch">
          <Button 
            type="button" 
            className="w-full bg-gold-500 text-black" 
            onClick={() => setShowForm(true)}
          >
            Team erstellen
          </Button>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Teamname"
            className="border p-2 rounded"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-gold-500 text-black px-4 py-2 rounded hover:bg-gold-700 transition"
            >
              {loading ? 'Erstellt…' : 'Team erstellen'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Abbrechen
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
}

export default CreateTeam;
