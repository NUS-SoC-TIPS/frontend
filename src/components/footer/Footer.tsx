import { memo, ReactElement } from 'react';
import { FaGithub } from 'react-icons/fa';
import {
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';

import { Logo } from '../logo';

const RawFooter = (): ReactElement<typeof Container> => (
  <Container
    as="footer"
    maxW="8xl"
    pb={4}
    pt={{ base: 12, md: 16 }}
    role="contentinfo"
  >
    <Stack spacing={{ base: 4, md: 5 }}>
      <Stack align="center" direction="row" justify="space-between">
        <Logo />
        <ButtonGroup variant="secondary">
          <IconButton
            aria-label="GitHub"
            as="a"
            border="none"
            href="https://github.com/NUS-SoC-TIPS"
            icon={<FaGithub fontSize="1.25rem" />}
          />
        </ButtonGroup>
      </Stack>
      <Text color="fg.subtle" fontSize="sm">
        &copy; {new Date().getFullYear()} Technical Interview Preparation
        (Summer). All rights reserved.
      </Text>
    </Stack>
  </Container>
);

export const Footer = memo(RawFooter);
