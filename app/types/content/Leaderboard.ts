export type Leaderboard = {
  __component: 'content.leaderboard';
  type:
    | 'donationSum'
    | 'allUsersByRuns'
    | 'groupUsersByRuns'
    | 'allUsersByDistance'
    | 'allUsersByDuration';
};
