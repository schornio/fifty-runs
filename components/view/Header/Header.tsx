import {
  HeaderMenu,
  HeaderMenuWrapper,
} from '@/components/composed/HeaderMenu';
import { Box } from '@/components/atomics/Box';
import { HorizontalRule } from '@/components/atomics/HorizontalRule';
import Image from 'next/image';
import Link from 'next/link';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function Header() {
  const session = await getCurrentSession();
  const user = await (session
    ? prisma.user.findUnique({ where: { id: session.userId } })
    : undefined);

  return (
    <header>
      <HeaderMenuWrapper>
        <Stack alignInline="center">
          <Box padding="normal" maxWidth="desktop">
            <Stack alignBlock="center" alignInline="spaceBetween">
              <Link href="/">
                <Image
                  alt="50runs"
                  height={50}
                  src="/image/Logo_50runs_neu.png"
                  width={155}
                />
              </Link>
              <HeaderMenu>
                <Box
                  color="background"
                  paddingOnTablet="double"
                  variant="filled"
                >
                  <Stack
                    alignBlock="center"
                    gap="normal"
                    gapOnTablet="double"
                    directionOnTablet="column"
                  >
                    <Link href="/leaderboard">
                      <Text fontSize="heading3" fontWeight="bold">
                        Leaderboard
                      </Text>
                    </Link>
                    <Link href="/postings">
                      <Text fontSize="heading3" fontWeight="bold">
                        Beiträge
                      </Text>
                    </Link>
                    {user?.name ? (
                      <>
                        <UserLabel
                          userImage={user.image}
                          userName={user.name}
                          userNameId={user.nameId}
                        />
                        <Link href="/user/logout" prefetch={false}>
                          <Text fontSize="heading3" fontWeight="bold">
                            Abmelden
                          </Text>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/user/login">
                          <Text fontSize="heading3" fontWeight="bold">
                            Anmelden
                          </Text>
                        </Link>
                        <Link href="/user/register">
                          <Text fontSize="heading3" fontWeight="bold">
                            Registrieren
                          </Text>
                        </Link>
                      </>
                    )}
                  </Stack>
                </Box>
              </HeaderMenu>
            </Stack>
          </Box>
        </Stack>
      </HeaderMenuWrapper>
      <HorizontalRule color="gray" />
    </header>
  );
}
