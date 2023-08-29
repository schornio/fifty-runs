import type { Meta, StoryObj } from '@storybook/react';
import { PostingImage } from './PostingImage';
import image from './storyAssets/image150x150.jpg';

const meta: Meta<typeof PostingImage> = {
  component: PostingImage,
};

export default meta;
type Story = StoryObj<typeof PostingImage>;

export const Default: Story = {
  args: { image: String(image) },
};
