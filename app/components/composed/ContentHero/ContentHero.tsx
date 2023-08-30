import { Box } from '@/components/atomics/Box';
import { Hero } from '@/types/content/Hero';
import Image from 'next/image';
import { Text } from '@/components/atomics/Text';

export function ContentHero({ data }: { data: Hero }) {
  return (
    <div style={{ height: '80dvh', position: 'relative', width: '100%' }}>
      {data.image?.data?.attributes.url ? (
        <Image
          alt=""
          style={{ objectFit: 'cover' }}
          fill={true}
          src={data.image?.data?.attributes.url}
          priority={true}
        />
      ) : null}
      {JSON.stringify(data)}
      {data.text ? (
        <div
          style={{
            left: '50%',
            position: 'absolute',
            top: '50%',
            transform: 'translate(-70%,-70%)',
            width: '20rem',
          }}
        >
          <Box padding="normal">
            <Text color="primary" fontSize="heading3">
              {data.text}
            </Text>
          </Box>
        </div>
      ) : null}
    </div>
  );
}
