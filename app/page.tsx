import { Box } from '@/components/view/Box';
import Image from 'next/image';
import { Typography } from '@/components/view/Typography';

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
          <Box padding="1">
            <Typography color="accent1" size="larger">
              <h1>#50runs</h1>
              Gemeinsam fit durch den Winter kommen und etwas Gutes tun. Was ist
              Deine Challenge?
            </Typography>
          </Box>
        </div>
      </div>
      <Box padding="1" maxWidth="tablet">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
        consequatur molestias id maiores quos ea eaque quasi atque sequi in
        excepturi voluptas voluptate delectus ipsam nostrum temporibus et,
        cupiditate quam.
      </Box>
    </>
  );
}
