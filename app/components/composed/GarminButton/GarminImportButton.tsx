"use client";

import { useState, useEffect } from "react";
import { SiGarmin } from "react-icons/si";
import { CiCircleInfo } from "react-icons/ci";

export default function GarminImportButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [isGarminConnected, setIsGarminConnected] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  //check  if garmin is connected
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

  //start garmin login
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

  //import garmin data
  const handleGarminImport = async () => {
    setLoading(true);
    setImportSuccess(false);

    try {
      const response = await fetch("/api/import-garmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Import der Garmin-Daten.");
      }

      setImportSuccess(true);
      console.log(await response.json());
    } catch (error) {
      alert("Es gab ein Problem beim Import der Garmin-Daten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
      <button
        onClick={isGarminConnected ? handleGarminImport : handleGarminLogin}
        className="flex items-center justify-center gap-2 bg-congress-blue-900 text-white
                   text-white rounded-lg w-full md:w-auto px-4 py-3 text-sm md:text-base font-semibold 
                  disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        <SiGarmin className="w-6 h-6 md:w-7 md:h-7" />
        {loading
          ? "Import läuft 📥"
          : importSuccess
          ? "Import erfolgreich ✅"
          : isGarminConnected
          ? "Meine Garmin-Aktivitäten importieren"
          : "Mit Garmin verbinden"}
      </button>

      <div
        className="relative flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <CiCircleInfo className="w-6 h-6 text-gray-600 cursor-pointer transition-transform duration-200 hover:scale-110" />

        {showTooltip && (
          <div className="absolute left-1/2 top-8 bg-gold-500 text-black text-xs 
                          rounded-md p-2 shadow-lg w-56 text-center z-10">
            Die Garmin API erlaubt nur den Import von Aktivitäten der letzten 24 Stunden.
          </div>
        )}
      </div>
    </div>
  );
}
