'use client';

import { useState, useEffect } from 'react';
import { CiCircleInfo } from 'react-icons/ci';
import { SiGarmin } from 'react-icons/si';

export default function GarminDisconnectButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isGarminConnected, setIsGarminConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //check if Garmin is connected
  useEffect(() => {
    const checkGarminStatus = async () => {
      try {
        const response = await fetch(`/api/check-garmin?userId=${userId}`);
        const data = await response.json();
        setIsGarminConnected(data.isConnected);
      } catch (error) {
        console.error('Fehler beim Überprüfen der Garmin-Verbindung:', error);
      }
    };

    checkGarminStatus();

    const handleStatusChange = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      setIsGarminConnected(detail.isConnected);
    };

    window.addEventListener('garminStatusChanged', handleStatusChange);
    return () => {
      window.removeEventListener('garminStatusChanged', handleStatusChange);
    };
  }, [userId]);

  //show disconnect button, only if user is connected and not already disconnected
  if (!isGarminConnected || isDisconnected) {
    return null;
  }

  //disconnect Garmin function
  const handleGarminDisconnect = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/garmin/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Trennen der Garmin-Verbindung.');
      }

      setIsDisconnected(true);
      setIsGarminConnected(false);
      // Informiere andere Komponenten über die Statusänderung
      window.dispatchEvent(
        new CustomEvent('garminStatusChanged', {
          detail: { isConnected: false },
        }),
      );
    } catch (error) {
      setError('Die Garmin-Verbindung konnte nicht getrennt werden.');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowConfirmModal(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-600 
                     px-4 py-3 text-sm font-semibold text-white transition-opacity 
                     duration-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
          disabled={loading}
        >
          <SiGarmin className="h-6 w-6 md:h-7 md:w-7" />
          {loading
            ? '🔄 Trenne Verbindung...'
            : isDisconnected
            ? '✅ Verbindung getrennt'
            : 'Garmin-Verbindung trennen'}
        </button>
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <CiCircleInfo className="h-6 w-6 cursor-pointer text-gray-600 transition-transform duration-200 hover:scale-110" />

          {showTooltip && (
            <div
            className="absolute left-1/2 top-8 z-10 w-auto sm:w-56 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md 
                       bg-gold-500 p-2 text-center text-xs text-black shadow-lg"
          >
              ⚠️ Achtung: Nach dem Trennen werden deine Garmin-Aktivitäten nicht
              mehr synchronisiert.
            </div>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="z-50 rounded-lg bg-white p-4 shadow-lg">
            <p className="mb-4 text-center text-gray-700">
              Bist du sicher, dass du die Garmin-Verbindung trennen möchtest?
              Dies führt dazu, dass deine Garmin-Aktivitäten nicht mehr
              automatisch synchronisiert werden.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-white"
                onClick={handleGarminDisconnect}
                disabled={loading}
              >
                Trennen
              </button>
              <button
                className="rounded-md bg-gray-300 px-4 py-2 text-black"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fehler-Pop-up */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="z-50 rounded-lg bg-white p-4 shadow-lg">
            <p className="mb-4 text-center text-gray-700">{error}</p>
            <div className="flex justify-center">
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
                onClick={() => setError(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
