import type { Color } from '@/style/Color';
import Image from 'next/image';
import { UserImageSize } from '@/style/UserImageSize';
import { mapStyles } from '@/util/mapStyles';
import { memo } from 'react';
import styles from './UserImage.module.css';

function UserImageComponent({
  color = 'primary',
  image,
  name,
  size = 'inline',
}: {
  color?: Color;
  image: string;
  name: string;
  size?: 'inline' | 'standalone';
}) {
  const className = mapStyles(styles, ['default'], { color, size });
  const imageSize = UserImageSize[size];
  return <Image {...imageSize} src={image} alt={name} className={className} />;
}

export const UserImage = memo(UserImageComponent);
