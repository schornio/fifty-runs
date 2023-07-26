import type { Meta, StoryObj } from '@storybook/react';
import { UserLabel } from './UserLabel';
import userImage from '../../atomics/UserImage/storyAssets/image150x150.jpg';

const meta: Meta<typeof UserLabel> = {
  component: UserLabel,
};

export default meta;
type Story = StoryObj<typeof UserLabel>;

export const Default: Story = {
  args: { userImage: String(userImage), userName: 'Username123' },
};

export const WithoutImage: Story = {
  args: { userName: 'Username123' },
};
