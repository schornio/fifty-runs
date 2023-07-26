import { Box } from '@/components/atomics/Box';
import Image from 'next/image';
import { Text } from '@/components/atomics/Text';

export default function Home() {
  return (
    <>
      <div style={{ height: '80dvh', position: 'relative', width: '100%' }}>
        <Image
          alt=""
          style={{ objectFit: 'cover' }}
          fill={true}
          src="/image/HighRes_007_2018-04-11_Rene-Voglmayr-Running_WEISS-auslaufend.png"
        />
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
              <h1>#50runs</h1>
              Gemeinsam fit durch den Winter kommen und etwas Gutes tun. Was ist
              Deine Challenge?
            </Text>
          </Box>
        </div>
      </div>
      <Box padding="normal" maxWidth="tablet">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
        consequatur molestias id maiores quos ea eaque quasi atque sequi in
        excepturi voluptas voluptate delectus ipsam nostrum temporibus et,
        cupiditate quam.
      </Box>
    </>
  );
}
