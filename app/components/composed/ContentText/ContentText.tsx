import { Box } from '@/components/atomics/Box';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { Text as TextType } from '@/types/content/Text';

export function ContentText({ data }: { data: TextType }) {
  return (
    <Box textAlign="center">
      <Text color="primary" fontSize="heading2">
        <Stack direction="column" gap="normal">
          {data.text}
        </Stack>
      </Text>
    </Box>
  );
}
