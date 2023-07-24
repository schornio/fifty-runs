import { Box } from '@/components/view/Box';
import { HeaderMenu } from '@/components/view/HeaderMenu';
import Image from 'next/image';
import Link from 'next/link';
import { Stack } from '@/components/view/Stack';
import { Typography } from '@/components/view/Typography';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Box padding="1" maxWidth="tablet">
        <Stack
          alignBlock="center"
          alignInline="space-between"
          direction="horizontal"
          directionOnMobile="vertical"
        >
          <a href="https://www.schorn.io">
            <Image
              alt="50runs"
              height={77}
              src="/image/schornio.png"
              width={200}
            />
          </a>
          <Stack alignBlock="center" direction="vertical" gap="1">
            <div className={styles.links}>
              <Link href="/impressum">Impressum</Link>
              <Link href="/datenschutz">Datenschutz</Link>
            </div>
          </Stack>
        </Stack>
      </Box>
    </footer>
  );
}
