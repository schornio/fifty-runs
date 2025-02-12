"use client";

import { useState, useEffect } from "react";
import { SiGarmin } from "react-icons/si";
import { CiCircleInfo } from "react-icons/ci";

export default function GarminImportButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [isGarminConnected, setIsGarminConnected] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  //status prüfen, ob der Nutzer bereits mit Garmin verbunden ist
  useEffect(() => {
    const checkGarminStatus = async () => {
      try {
        const response = await fetch(`/api/check-garmin?userId=${userId}`);
        const data = await response.json();
        setIsGarminConnected(data.isConnected);
      } catch (error) {
        console.error("Fehler beim Überprüfen der Garmin-Verbindung:", error);
      }
    };

    checkGarminStatus();
  }, [userId]);

  //user ist nicht angemeldet → Weiterleitung zur Garmin-Anmeldung
  const handleGarminLogin = async () => {
    try {
      const response = await fetch("/api/auth/garmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Starten des Garmin-Logins.");
      }

      const data = await response.json();
      window.location.href = data.authUrl;
    } catch (error) {
      alert("Fehler beim Garmin-Login.");
    }
  };

  //User schon verbunden → Aktivitäten importieren
  const handleGarminImport = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/import-garmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Import der Garmin-Daten.");
      }

      alert("Garmin-Daten erfolgreich importiert.");
      console.log(await response.json());
    } catch (error) {
      alert("Es gab ein Problem beim Import der Garmin-Daten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isGarminConnected ? handleGarminImport : handleGarminLogin}
        className="flex items-center gap-2 bg-congress-blue-900 text-white rounded-lg px-4 py-2 font-semibold"
        disabled={loading}
      >
        <SiGarmin className="w-7 h-7" /> {/* Garmin-Icon */}
        {loading
          ? "Import läuft..."
          : isGarminConnected
          ? "Meine Garmin-Aktivitäten importieren"
          : "Mit Garmin verbinden"}
      </button>

      {/* Info-Icon mit Tooltip */}
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <CiCircleInfo className="w-6 h-6 text-gray-600 cursor-pointer" />

        {showTooltip && (
          <div className="absolute left-8 bottom-0 bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg w-56">
            Die Garmin API erlaubt es nur, die Aktivitäten der letzten 24 Stunden zu importieren.
          </div>
        )}
      </div>
    </div>
  );
}
