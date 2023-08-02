import Image from 'next/image';
import { PostingImageSize } from '@/style/PostingImageSize';
import { mapStyles } from '@/util/mapStyles';
import { memo } from 'react';
import styles from './PostingImage.module.css';

function PostingImageComponent({
  image,
  size = 'standalone',
}: {
  image: string;
  size?: 'standalone';
}) {
  const className = mapStyles(styles, ['default'], { size });
  const imageSize = PostingImageSize[size];
  return <Image {...imageSize} src={image} alt="" className={className} />;
}

export const PostingImage = memo(PostingImageComponent);
