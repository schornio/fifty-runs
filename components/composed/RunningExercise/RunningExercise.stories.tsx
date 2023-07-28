import type { Meta, StoryObj } from '@storybook/react';
import { RunningExercise } from './RunningExercise';

const meta: Meta<typeof RunningExercise> = {
  component: RunningExercise,
};

export default meta;
type Story = StoryObj<typeof RunningExercise>;

export const Default: Story = {
  args: {
    distanceInMeters: 1000,
    durationInSeconds: 60 * 60,
  },
};
