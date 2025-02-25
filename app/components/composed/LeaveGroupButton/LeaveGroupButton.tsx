import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

interface LeaveButtonProps {
  groupId: string;
}

const LeaveButton = ({ groupId }: LeaveButtonProps) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [adminWarningModal, setAdminWarningModal] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
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
          setAdminWarningModal(true);
          return;
        } else {
          setError(data.error || 'Ein Fehler ist aufgetreten.');
          return;
        }
      }

      // Bei Erfolg: Erfolgsmeldung anzeigen (kein alert!)
      setSuccessModalOpen(true);
    } catch (err) {
      setError('Fehler beim Verlassen der Gruppe.');
    }
  };

  const handleConfirmLeave = () => {
    setConfirmModalOpen(false);
    handleLeave();
  };

  return (
    <>
      <button
        onClick={() => setConfirmModalOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Gruppe verlassen
      </button>
      
      {error && <div className="text-red-500 mt-2">{error}</div>}

      {/* Bestätigungsmodal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Gruppe verlassen?</h2>
            <p className="mb-6">
              Bist du sicher, dass du die Gruppe verlassen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmLeave}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Ja, verlassen
              </button>
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin-Warnung, wenn Admin noch nicht die Rechte übertragen hat */}
      {adminWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Achtung!</h2>
            <p className="mb-6">
              Du bist aktuell Administrator dieser Gruppe. Bitte übertrage zuerst Deine Admin-Rechte an ein anderes Mitglied, bevor du die Gruppe verlässt.
            </p>
            <button
              onClick={() => setAdminWarningModal(false)}
              className="bg-congress-blue-800 hover:bg-congress-blue-900 text-white font-bold py-2 px-4 rounded"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* Erfolgsmeldung */}
      {successModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full text-center">
            <FaCheckCircle className="text-green-500 mx-auto text-6xl mb-4" />
            <h2 className="text-2xl font-bold mb-4">Gruppe erfolgreich verlassen</h2>
            <button
              onClick={() => router.push('/')}
              className="bg-congress-blue-800 hover:bg-congress-blue-900 text-white font-bold py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveButton;
