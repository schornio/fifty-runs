'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/atomics/Button';
import { Text } from '@/components/atomics/Text';
import { UserImage } from '@/components/atomics/UserImage';
import { JoinRequestButton } from '@/components/composed/JoinRequestButton/JoinRequestButton';
import InviteTeam from '../InviteTeam/InviteTeam';
import LeaveGroupButton from '@/components/composed/LeaveGroupButton/LeaveGroupButton';
import TransferAdminButton from '../TransferAdminButton/TransferAdminButton';

interface Team {
  id: string;
  name: string;
  adminId: string | null;
  totalDistance: number;
  totalDuration: number;
  users: { id: string; name: string; image?: string }[];
  totalRuns: number;
  avgTimePerKm: number;
}

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
};

const formatTimePerKm = (secondsPerKm: number) => {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}m ${seconds}s / km`;
};

const TeamDetail = () => {
  const router = useRouter();
  const { nameId } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [hasRequested, setHasRequested] = useState<boolean | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/session');
        const data = await res.json();
        if (data.user) {
          setCurrentUserId(data.user.id);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Session:', error);
      }
    };
    fetchSession();
  }, []);

  //load team
  useEffect(() => {
    if (!nameId) return;
    const fetchTeam = async () => {
      const response = await fetch(`/api/group/by-name/${nameId}`);
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    };
    fetchTeam();
  }, [nameId]);

  //member check
  useEffect(() => {
    if (!team) return;
    const checkMembership = async () => {
      const res = await fetch(`/api/group/${team.id}/invite`, {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        setIsMember(data.isMember);
      } else {
        setIsMember(false);
      }
    };
    checkMembership();
  }, [team]);

  //check join request
  useEffect(() => {
    if (!team) return;
    if (isMember === false) {
      const checkJoinRequest = async () => {
        const res = await fetch(`/api/group/${team.id}/request`, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setHasRequested(data.hasRequested);
        } else {
          setHasRequested(false);
        }
      };
      checkJoinRequest();
    }
  }, [team, isMember]);

  if (!team || !currentUserId) return <Text fontSize="normal">Lädt...</Text>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="rounded-lg bg-white p-6 text-center shadow-md">
        <div className="flex flex-col items-center space-y-4">
          <Text fontSize="heading1" fontWeight="bold" className="text-congress-blue-900">
            {team.name}
          </Text>
          {isMember === false &&
            (hasRequested ? (
              <Text className="text-green-500 font-semibold">
                Beitrittsanfrage wurde bereits erfolgreich gesendet.
              </Text>
            ) : (
              <JoinRequestButton groupId={team.id} />
            ))}
        </div>

        <div className="mx-auto max-w-md text-center mt-6">
          <InviteTeam id={team.id} />
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 text-center shadow-md">
        <div className="flex flex-wrap justify-around gap-6">
          <div className="flex w-1/3 flex-col items-center rounded-lg bg-gray-100 p-6">
            <Text className="mb-2 text-lg font-medium text-gray-700">Gesamtkilometer 🏃‍♂️</Text>
            <Text className="text-xl font-bold text-congress-blue-900">
              {team.totalDistance.toFixed(2)} km
            </Text>
          </div>

          <div className="flex w-1/3 flex-col items-center rounded-lg bg-gray-100 p-6">
            <Text className="mb-2 text-lg font-medium text-gray-700">Gesamtzeit ⏱️</Text>
            <Text className="text-xl font-bold text-congress-blue-900">
              {formatDuration(team.totalDuration)}
            </Text>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-gray-100 p-6">
            <Text className="mb-2 text-lg font-medium text-gray-700">
              Durchschnittliche Zeit pro km ⏳
            </Text>
            <Text className="text-xl font-bold text-congress-blue-900">
              {team.totalDistance > 0 ? formatTimePerKm(team.avgTimePerKm) : 'Keine Daten'}
            </Text>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <Text fontSize="heading3" fontWeight="bold" className="mb-4 text-congress-blue-900">
          Mitglieder 👥
        </Text>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {team.users.map((user) => (
            <div key={user.id} className="flex flex-col items-center rounded-lg p-4">
              <UserImage image={user.image ?? '/default-avatar.png'} name={user.name} />
              <Text className="mt-2 text-sm font-medium">{user.name}</Text>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button type="button" onClick={() => router.push('/')} className="bg-congress-blue-900 px-6 py-2 text-white">
          Zurück
        </Button>
        {isMember && <LeaveGroupButton groupId={team.id} />}
        <TransferAdminButton groupId={team.id} />
      </div>
    </div>
  );
};

export default TeamDetail;