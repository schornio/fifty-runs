import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { Text } from "@/components/atomics/Text";

const InviteTeam = ({ id }: { id: string }) => {
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const response = await fetch(`/api/group/${id}/invite`);
        if (!response.ok) {
          setIsMember(false);
          return;
        }
        const data = await response.json();
        setIsMember(data.isMember);
      } catch {
        setIsMember(false);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [id]);


  useEffect(() => {
    if (isMember && !inviteLink) {
      const generateInvite = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await fetch(`/api/group/${id}/invite`, {
            method: "POST",
          });
          const data = await response.json();
          if (response.ok) {
            setInviteLink(`${window.location.origin}/join/${data.token}`);
          } else {
            setError(data.error || "Fehler beim Erstellen des Links.");
          }
        } catch (err) {
          setError("Netzwerkfehler beim Erstellen der Einladung.");
        } finally {
          setLoading(false);
        }
      };

      generateInvite();
    }
  }, [isMember, id, inviteLink]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopieren fehlgeschlagen", err);
    }
  };

  if (loading) {
    return <Text className="text-gray-500">Lädt...</Text>;
  }

  if (!isMember) return null;

  return (
    <div className="mt-4 p-6">
      {error && <Text className="text-red-500 mb-4">{error}</Text>}

      {inviteLink && (
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-50 p-4 rounded-md text-center break-all">
            <Text className="text-gray-700">{inviteLink}</Text>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className={`mt-3 flex items-center space-x-2 px-4 py-2 rounded-md transition text-white ${
              copied
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <FiCopy size={18} />
            <span>{copied ? "Kopiert!" : "Kopieren"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InviteTeam;
