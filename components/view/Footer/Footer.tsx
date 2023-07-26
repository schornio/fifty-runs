import { Box } from '@/components/atomics/Box';
import Image from 'next/image';
import Link from 'next/link';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';

export function Footer() {
  return (
    <footer>
      <Box color="secondary" variant="filled">
        <Stack alignInline="center">
          <Box padding="normal" maxWidth="tablet">
            <Stack
              alignBlock="center"
              alignInline="spaceBetween"
              directionOnMobile="column"
            >
              <Link href="https://www.schorn.io">
                <Image
                  alt="50runs"
                  height={77}
                  src="/image/schornio.png"
                  width={200}
                />
              </Link>
              <Stack alignBlock="center" direction="row" gap="normal">
                <Link href="/impressum">
                  <Text fontSize="heading3" fontWeight="bold">
                    Impressum
                  </Text>
                </Link>
                <Link href="/datenschutz">
                  <Text fontSize="heading3" fontWeight="bold">
                    Datenschutz
                  </Text>
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </footer>
  );
}
