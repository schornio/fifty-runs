import AllUserByDistance from '@/components/composed/ContentLeaderboard/AllUsersByDistance';
import AllUsersByDuration from '@/components/composed/ContentLeaderboard/AllUsersByDuration';
import AllUsersByRuns from '@/components/composed/ContentLeaderboard/AllUsersByRuns';
import DonationSum from '@/components/composed/ContentLeaderboard/DonationSum';
import GroupUsersByRuns from '@/components/composed/ContentLeaderboard/GroupUsersByRuns';
import { Leaderboard } from '@/types/content/Leaderboard';

export function ContentLeaderboard({ data }: { data: Leaderboard }) {
  switch (data.type) {
    case 'donationSum':
      return <DonationSum />;
    case 'allUsersByRuns':
      return <AllUsersByRuns />;
    case 'groupUsersByRuns':
      return <GroupUsersByRuns />;
    case 'allUsersByDistance':
      return <AllUserByDistance />;
    case 'allUsersByDuration':
      return <AllUsersByDuration />;
  }
}
