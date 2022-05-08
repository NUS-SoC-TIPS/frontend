import { PropsWithChildren, ReactElement } from 'react';
import { Box, Container } from '@chakra-ui/react';

import { Footer } from 'components/footer';
import { Navbar } from 'components/navbar';

export const Page = ({
  children,
}: PropsWithChildren<unknown>): ReactElement<typeof Box> => (
  <Box as="section" height="100vh" overflowY="auto">
    <Navbar />
    <Container
      maxWidth="100%"
      pb={{ base: '12', lg: '24' }}
      pt={{ base: '8', lg: '12' }}
    >
      {children}
    </Container>
    <Footer />
  </Box>
);
