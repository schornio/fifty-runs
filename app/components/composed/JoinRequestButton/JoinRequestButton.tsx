'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PiUserCirclePlusThin, PiCheckThin } from 'react-icons/pi';

interface JoinRequestButtonProps {
  groupId: string;
  showIcon?: boolean;
}

export function JoinRequestButton({ groupId, showIcon = false }: JoinRequestButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkJoinRequest = async () => {
      try {
        const res = await fetch(`/api/group/${groupId}/request`);
        const data = await res.json();
        if (res.ok) {
          setHasRequested(data.hasRequested);
          setSuccess(data.hasRequested);
        }
      } catch (err) {
        console.error('Fehler beim Prüfen der Beitrittsanfrage:', err);
      }
    };

    checkJoinRequest();
  }, [groupId]);

  const handleJoinRequest = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/group/${groupId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Beitrittsanfrage konnte nicht gesendet werden.');
      } else {
        setSuccess(true);
        setHasRequested(true);
      }
    } catch (err: any) {
      setError(err.message || 'Unbekannter Fehler.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      router.refresh();
    }
  }, [success, router]);

  if (success || hasRequested) {
    return <PiCheckThin className="h-5 w-5 text-green-500" />;
  }

  if (showIcon) {
    return (
      <PiUserCirclePlusThin
        onClick={handleJoinRequest}
        className={`h-5 w-5 cursor-pointer text-congress-blue-900 hover:text-congress-blue-700 ${
          loading ? 'cursor-not-allowed opacity-50' : ''
        }`}
      />
    );
  }

  return (
    <div>
      <button
        onClick={handleJoinRequest}
        disabled={loading}
        className={`bg-gold-500 text-black font-semibold px-4 py-2 rounded ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gold-700'
        }`}
      >
        {loading ? 'Sende Anfrage...' : 'Beitrittsanfrage senden'}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
