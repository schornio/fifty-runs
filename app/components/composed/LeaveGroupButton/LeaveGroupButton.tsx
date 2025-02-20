import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LeaveButtonProps {
  groupId: string;
}

const LeaveButton = ({ groupId }: LeaveButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLeave = async () => {
    try {
      const response = await fetch(`/api/group/${groupId}/leave`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.includes('Admin muss zuerst')) {
          setModalOpen(true);
          return;
        } else {
          setError(data.error || 'Ein Fehler ist aufgetreten.');
          return;
        }
      }

      alert('Gruppe erfolgreich verlassen!');
      router.push('/');
    } catch (err) {
      setError('Fehler beim Verlassen der Gruppe.');
    }
  };

  return (
    <>
      <button
        onClick={handleLeave}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Gruppe verlassen
      </button>
      
      {error && <div className="text-red-500 mt-2">{error}</div>}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Achtung!</h2>
            <p className="mb-6">
              Du bist aktuell Administrator dieser Gruppe. Bitte übertrage zuerst Deine Admin-Rechte
              an ein anderes Mitglied, bevor Du die Gruppe verlässt.
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-congress-blue-800 hover:bg-congress-blue-900 text-white font-bold py-2 px-4 rounded"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveButton;
