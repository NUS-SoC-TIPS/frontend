import { ReactElement } from 'react';
import { FiInfo } from 'react-icons/fi';
import {
  Box,
  Icon,
  Square,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

interface Props {
  title: string;
  message: string;
}

export const Banner = ({
  title,
  message,
}: Props): ReactElement<Props, typeof Box> => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box
      bg="bg-accent"
      borderRadius="xl"
      color="on-accent"
      position="relative"
      px={{ base: 4, md: 3 }}
      py={{ base: 4, md: 2.5 }}
    >
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        pb={0.5}
        spacing={{ base: 3, md: 2 }}
      >
        <Stack
          align={{ base: 'start', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
        >
          {!isMobile && (
            <Square bg="accent-subtle" borderRadius="md" size={12}>
              <Icon as={FiInfo} boxSize={6} />
            </Square>
          )}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            pe={{ base: 4, sm: 0 }}
            spacing={{ base: 0.5, md: 1.5 }}
          >
            <Text fontWeight="medium">{title}</Text>
            <Text color="on-accent-muted">{message}</Text>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
