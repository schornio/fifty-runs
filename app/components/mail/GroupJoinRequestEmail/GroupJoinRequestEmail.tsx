import React from 'react';

interface GroupJoinRequestEmailProps {
  adminName: string;
  userName: string;
  groupName: string;
}

export const GroupJoinRequestEmail = ({ adminName, userName, groupName }: GroupJoinRequestEmailProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.5 }}>
    <h1>Hallo {adminName},</h1>
    <p>
      {userName} hat eine Beitrittsanfrage für Deine Gruppe "{groupName}" gesendet.
    </p>
    <p>
      Bitte logge Dich in Dein Konto ein, um die Anfrage zu überprüfen und zu entscheiden, ob Du
      den Benutzer in Deine Gruppe aufnehmen möchtest.
    </p>
    <p>Viele Grüße, <br /> Dein 50runs-Team</p>
  </div>
);
