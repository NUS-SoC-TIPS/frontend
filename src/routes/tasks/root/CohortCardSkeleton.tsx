import { ReactElement } from 'react';
import { Badge, Box, Stack, Text } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/react';

export const CohortCardSkeleton = (): ReactElement<typeof Box> => {
  return (
    <Box
      bg="bg-surface"
      borderRadius="lg"
      boxShadow="sm"
      p={{ base: 4, md: 6 }}
    >
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: 4, md: 6 }}
      >
        <Stack spacing={{ base: 0, md: 1 }}>
          <Stack
            align={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column-reverse', md: 'row' }}
            spacing={{ base: 0.5, md: 3 }}
          >
            <Skeleton>
              <Text fontSize="lg" fontWeight="medium">
                AY 20/21 Summer
              </Text>
            </Skeleton>
            <Skeleton>
              <Badge size="sm">Completed</Badge>
            </Skeleton>
          </Stack>
          <Skeleton>
            <Text color="muted" fontSize="sm">
              May 21, 2023 - May 22, 2023
            </Text>
          </Skeleton>
        </Stack>
      </Stack>
    </Box>
  );
};
