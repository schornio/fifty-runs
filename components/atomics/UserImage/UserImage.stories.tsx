import type { Meta, StoryObj } from '@storybook/react';
import { UserImage } from './UserImage';
import image from './storyAssets/image150x150.jpg';

const meta: Meta<typeof UserImage> = {
  component: UserImage,
};

export default meta;
type Story = StoryObj<typeof UserImage>;

export const Default: Story = {
  args: { image: String(image), name: 'This face does not exist.' },
};
