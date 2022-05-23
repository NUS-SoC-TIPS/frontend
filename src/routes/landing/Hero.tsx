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

import addQuestion from 'assets/images/add_question.png';
import { GitHubIcon } from 'components/icons/GitHubIcon';

interface Props {
  onGetStarted: () => void | Promise<void>;
  isGettingStarted: boolean;
}

export const Hero = ({
  onGetStarted,
  isGettingStarted,
}: Props): ReactElement<Props, typeof Box> => {
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
            Tech interview preparation made easier.
          </Heading>
          <Text fontSize="xl" maxW="xl" mt="4" mx="auto">
            Ace your upcoming technical interviews by practicing mock interviews
            and tracking questions on TIPS.
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
            isLoading={isGettingStarted}
            leftIcon={<GitHubIcon boxSize="5" />}
            onClick={onGetStarted}
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
          <Img alt="Screenshot of App" src={addQuestion} />
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
