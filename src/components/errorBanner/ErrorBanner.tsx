import { ReactElement } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import {
  Box,
  Button,
  Container,
  Icon,
  Square,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

export const ErrorBanner = (): ReactElement<typeof Container> => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Container as="section" pb={{ base: 12, md: 24 }} pt={{ base: 4, md: 8 }}>
      <Box
        bg="error"
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
              <Square bg="error-subtle" borderRadius="md" size={12}>
                <Icon as={FiAlertTriangle} boxSize={6} />
              </Square>
            )}
            <Stack
              direction={{ base: 'column', md: 'row' }}
              pe={{ base: 4, sm: 0 }}
              spacing={{ base: 0.5, md: 1.5 }}
            >
              <Text fontWeight="medium">Sorry, something went wrong!</Text>
              <Text color="on-accent-muted">
                Please reload the page and try again.
              </Text>
            </Stack>
          </Stack>
          <Stack
            align={{ base: 'stretch', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
            spacing={{ base: 3, sm: 2 }}
          >
            <Button
              _active={{ bg: 'red.100' }}
              _hover={{ bg: 'red.100' }}
              bg="red.50"
              color="red.600"
              onClick={(): void => window.location.reload()}
              width="full"
            >
              Reload
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};
