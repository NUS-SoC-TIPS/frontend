import { ReactElement } from 'react';
import { FaPlay } from 'react-icons/fa';
import {
  Box,
  Button,
  Circle,
  Heading,
  Img,
  Stack,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react';

import { GitHubIcon } from 'components/icons/GitHubIcon';

export const Hero = (): ReactElement<typeof Box> => {
  return (
    <Box as="section" py="2.5rem">
      <Box maxW={{ base: 'xl', md: '5xl' }} mx="auto">
        <Box textAlign="center">
          <Heading
            as="h1"
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="1.2"
            maxW="48rem"
            mx="auto"
            size="3xl"
          >
            Tech interview preparation made easier
          </Heading>
          <Text fontSize="xl" maxW="xl" mt="4" mx="auto">
            Ace your upcoming technical interviews by practicing mock interviews
            and questions on TIPS.
          </Text>
        </Box>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="center"
          mb="20"
          mt="10"
          spacing="4"
        >
          <Button
            as="a"
            fontSize="md"
            fontWeight="bold"
            href="#"
            iconSpacing="3"
            leftIcon={<GitHubIcon boxSize="5" />}
            px="8"
            size="lg"
            variant="primary"
          >
            Get started with GitHub
          </Button>
        </Stack>

        <Box
          className="group"
          cursor="pointer"
          overflow="hidden"
          position="relative"
          rounded="lg"
        >
          <Img
            alt="Screenshot of Envelope App"
            src="https://res.cloudinary.com/chakra-ui-pro/image/upload/v1621085270/pro-website/app-screenshot-light_kit2sp.png"
          />
          <Circle
            _groupHover={{
              transform: 'translate3d(-50%, -50%, 0) scale(1.05)',
            }}
            as="button"
            bg="white"
            color="accent"
            fontSize="xl"
            left="50%"
            position="absolute"
            shadow="lg"
            size="20"
            top="50%"
            transform="translate3d(-50%, -50%, 0)"
            transition="all 0.2s"
          >
            <VisuallyHidden>Play demo video</VisuallyHidden>
            <FaPlay />
          </Circle>
        </Box>
      </Box>
    </Box>
  );
};