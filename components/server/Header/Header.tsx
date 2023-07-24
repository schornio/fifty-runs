import { Box } from '@/components/view/Box';
import { HeaderMenu } from '@/components/view/HeaderMenu';
import Image from 'next/image';
import Link from 'next/link';
import { Stack } from '@/components/view/Stack';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';
import styles from './Header.module.css';

export async function Header() {
  const session = await getCurrentSession();
  const user = await (session
    ? prisma.user.findUnique({ where: { id: session.userId } })
    : undefined);

  return (
    <header className={styles.header}>
      <Box padding="1" maxWidth="desktop">
        <Stack
          alignBlock="center"
          alignInline="space-between"
          direction="horizontal"
        >
          <Link href="/">
            <Image
              alt="50runs"
              height={50}
              src="/image/Logo_50runs_neu.png"
              width={155}
            />
          </Link>
          <HeaderMenu
            userImage={user?.image ?? undefined}
            userName={user?.name}
          />
        </Stack>
      </Box>
    </header>
  );
}
