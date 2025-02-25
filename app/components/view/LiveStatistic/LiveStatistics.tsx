'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LiveStatistics({ userId }: { userId: string | number }) {
  const { data, error } = useSWR(`/api/stats?userId=${userId}`, fetcher, {
    refreshInterval: 5000,
  });

  if (error) return <div className="flex flex-col gap-3 py-5 text-center"> Fehler beim Laden der Statistik.</div>;
  if (!data) return <div className="flex flex-col gap-3 py-5 text-center">Lade Statistik...</div>;

  return (
    <div className="flex flex-col gap-3 py-5 text-center">
      <div>
        <span className="text-xl font-bold text-congress-blue-900">
          {data.totalDurationHours > 0
            ? `${data.totalDurationHours}h ${data.remainingMinutes}min 🏃`
            : `${data.remainingMinutes}min 🏃`}
        </span>
        <div>Gesamte Laufdauer</div>
      </div>
      <div>
        <span className="text-xl font-bold text-congress-blue-900">
          {data.totalDistanceInKilometers} km 🚀
        </span>
        <div>Gesamte Kilometer</div>
      </div>
      <div>
        <span className="text-xl font-bold text-congress-blue-900">
          {data.averageMinutesPerKilometer
            ? `${data.averageMinutesPerKilometer} min/km`
            : 'Keine Daten'}{' '}
          ⌚️
        </span>
        <div>Durchschnittliche Minuten pro Kilometer</div>
      </div>
    </div>
  );
}
