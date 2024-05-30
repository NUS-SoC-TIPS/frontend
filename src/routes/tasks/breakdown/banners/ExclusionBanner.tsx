import { ReactElement } from 'react';
import { FiZapOff } from 'react-icons/fi';
import {
  Box,
  Button,
  Container,
  ContainerProps,
  Icon,
  Link,
  Square,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

interface Props {
  exclusion: { reason: string };
}

export const ExclusionBanner = (
  props: Props,
): ReactElement<Props, typeof Container> => {
  const isMobile = useBreakpointValue(
    { base: true, md: false },
    { ssr: false },
  );
  const containerProps: ContainerProps = {
    pb: 4,
    pt: 4,
    px: 0,
    maxW: '100%',
  };

  return (
    <Container as="section" {...containerProps}>
      <Box
        bg="red.500"
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
              <Square bg="red.300" borderRadius="md" size={12}>
                <Icon as={FiZapOff} boxSize={6} />
              </Square>
            )}
            <Stack
              direction={{ base: 'column', md: 'row' }}
              pe={{ base: 4, sm: 0 }}
              spacing={{ base: 0.5, md: 1.5 }}
            >
              <Text fontWeight="medium">
                Your course access has been downgraded starting from this week.
              </Text>
              <Text color="on-accent-muted">
                Reason: {props.exclusion.reason}
              </Text>
            </Stack>
          </Stack>
          <Stack
            align={{ base: 'stretch', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
            spacing={{ base: 3, sm: 2 }}
          >
            <Link href="mailto:soc-tips24@googlegroups.com">
              <Button
                _active={{ bg: 'red.100' }}
                _hover={{ bg: 'red.100' }}
                bg="red.50"
                color="red.600"
                width="full"
              >
                Appeal via Email
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};
