'use client';

import { useState, useEffect } from 'react';
import { SiGarmin } from 'react-icons/si';
import { CiCircleInfo } from 'react-icons/ci';

export default function GarminImportButton({ userId }: { userId: string }) {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isGarminConnected, setIsGarminConnected] = useState(false);
  const [garminStatusLoading, setGarminStatusLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/session');
        const data = await response.json();
        if (data.user) {
          setSessionUserId(data.user.id);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Session:', error);
      } finally {
        setIsSessionLoading(false);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (isSessionLoading || sessionUserId !== userId) return;

    const checkGarminStatus = async () => {
      try {
        const response = await fetch(`/api/check-garmin?userId=${userId}`);
        const data = await response.json();
        setIsGarminConnected(data.isConnected);
      } catch (error) {
        console.error('Fehler beim Überprüfen der Garmin-Verbindung:', error);
      } finally {
        setGarminStatusLoading(false);
      }
    };

    checkGarminStatus();
  }, [userId, isSessionLoading, sessionUserId]);

  useEffect(() => {
    const handleStatusChange = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      setIsGarminConnected(detail.isConnected);
    };

    window.addEventListener('garminStatusChanged', handleStatusChange);
    return () => {
      window.removeEventListener('garminStatusChanged', handleStatusChange);
    };
  }, []);

  const handleGarminLogin = async () => {
    try {
      const response = await fetch('/api/auth/garmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error('Fehler beim Starten des Garmin-Logins.');
      }
      const data = await response.json();
      window.location.href = data.authUrl;
    } catch (error) {
      alert('Fehler beim Garmin-Login. Bitte versuchen Sie es erneut.');
    }
  };

  if (isSessionLoading) {
    return null;
  }

  if (sessionUserId !== userId) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={!isGarminConnected ? handleGarminLogin : undefined}
        className="flex items-center justify-center gap-2 rounded-lg bg-congress-blue-900 
                   px-4 py-3 text-sm font-semibold text-white transition-opacity 
                   duration-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
        disabled={isGarminConnected || garminStatusLoading}
      >
        <SiGarmin className="h-6 w-6 md:h-7 md:w-7" />
        {garminStatusLoading
          ? '🔄 Lade Status...'
          : isGarminConnected
          ? '✅ Garmin verbunden'
          : 'Mit Garmin verbinden'}
      </button>
      <div
        className="relative flex items-center"
        onMouseEnter={() => {
          if (isGarminConnected) setShowTooltip(true);
        }}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {showTooltip && isGarminConnected && (
          <>
            <CiCircleInfo className="h-6 w-6 cursor-pointer text-gray-600 transition-transform duration-200 hover:scale-110" />
            <div className="absolute left-1/2 top-8 z-10 w-auto max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md bg-gold-500 p-2 text-center text-xs text-black shadow-lg sm:w-56">
              ✅ Garmin-Integration aktiv: Aktivitäten werden automatisch synchronisiert.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
