import { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { GrUserAdmin } from "react-icons/gr";

interface Member {
  id: string;
  name: string;
}

interface TransferAdminButtonProps {
  groupId: string;
}

const TransferAdminButton = ({ groupId }: TransferAdminButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  //current user from session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/session');
        const data = await res.json();
        if (data.user?.id) {
          setCurrentUserId(data.user.id);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Session:', err);
      }
    };
    fetchSession();
  }, []);

  //admin id from group
  useEffect(() => {
    const fetchGroupAdmin = async () => {
      try {
        const res = await fetch(`/api/group/${groupId}/members`);
        const data = await res.json();
        if (res.ok) {
          setAdminId(data.adminId);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Gruppeninformationen:', err);
      }
    };
    fetchGroupAdmin();
  }, [groupId]);

  //button only for admin
  if (currentUserId !== adminId) {
    return null;
  }

  //fetch members
  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/group/${groupId}/members`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Fehler beim Laden der Mitglieder.');
      } else {
        setMembers(data.members);
      }
    } catch (err) {
      setError('Fehler beim Laden der Mitglieder.');
    }
    setLoading(false);
  };

  //admin transfer
  const handleTransfer = async (newAdminId: string) => {
    setError('');
    try {
      const res = await fetch(`/api/group/${groupId}/transfer-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAdminId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Fehler bei der Admin-Übergabe.');
      } else {
        setTransferSuccess(true);
      }
    } catch (err) {
      setError('Fehler bei der Admin-Übergabe.');
    }
  };

  const openModal = () => {
    setModalOpen(true);
    setTransferSuccess(false);
    fetchMembers();
  };

  const closeModal = () => {
    setModalOpen(false);
    setTransferSuccess(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="ml-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
      >
        Admin-Rechte übertragen
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            {transferSuccess ? (
              <div className="flex flex-col items-center">
                <FaCheckCircle className="mb-4 text-6xl text-green-500" />
                <h2 className="mb-2 text-2xl font-bold">
                  Erfolgreich übertragen!
                </h2>
                <p className="mb-4 text-center">
                  Die Admin-Rechte wurden erfolgreich an das ausgewählte
                  Mitglied übergeben.
                </p>
                <button
                  onClick={closeModal}
                  className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
                >
                  Schließen
                </button>
              </div>
            ) : (
              <>
                <h2 className="mb-4 text-2xl font-bold">
                  Admin-Rechte übertragen
                </h2>
                {loading ? (
                  <div>Mitglieder werden geladen...</div>
                ) : error ? (
                  <div className="mb-4 text-red-500">{error}</div>
                ) : (
                  <ul className="max-h-60 space-y-2 overflow-y-auto">
                    {members
                      .filter((member) => member.id !== adminId)
                      .map((member) => (
                        <li
                          key={member.id}
                          className="flex items-center justify-between rounded border p-2"
                        >
                          <span>{member.name}</span>
                          <button
                            onClick={() => handleTransfer(member.id)}
                            className="flex items-center rounded border border-blue-500 px-3 py-1 font-bold text-blue-500 hover:bg-gold-500 hover:text-black hover:border-gold-500"
                          >
                            <GrUserAdmin className="mr-2" />
                            Als Admin festlegen
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600"
                  >
                    Schließen
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TransferAdminButton;
