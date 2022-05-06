import { ReactElement } from 'react';
import { FiSettings } from 'react-icons/fi';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

import { Logo } from './Logo';
import { Sidebar } from './Sidebar';
import { ToggleButton } from './ToggleButton';

export const Navbar = (): ReactElement<typeof Box> => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle, onClose } = useDisclosure();
  const user = null;

  return (
    <Box
      as="nav"
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
    >
      <Container maxWidth="100%" py={{ base: '3', lg: '4' }}>
        <Flex justify="space-between">
          <HStack spacing="4">
            <Logo />
            {isDesktop && user && (
              <ButtonGroup spacing="1" variant="ghost">
                <Button aria-current="page">Interviews</Button>
                <Button>LeetCode</Button>
                <Button>Tasks</Button>
              </ButtonGroup>
            )}
          </HStack>
          {isDesktop || !user ? (
            <HStack spacing="4">
              {user ? (
                <>
                  <ButtonGroup spacing="1" variant="ghost">
                    <IconButton
                      aria-label="Settings"
                      icon={<FiSettings fontSize="1.25rem" />}
                    />
                  </ButtonGroup>
                  <Avatar
                    boxSize="10"
                    name="Christoph Winston"
                    src="https://tinyurl.com/yhkm2ek8"
                  />
                </>
              ) : (
                <Button variant="primary">Log in</Button>
              )}
            </HStack>
          ) : (
            <>
              <ToggleButton
                aria-label="Open Menu"
                isOpen={isOpen}
                onClick={onToggle}
              />
              <Drawer
                isFullHeight={true}
                isOpen={isOpen}
                onClose={onClose}
                placement="left"
                preserveScrollBarGap={true}
                // Only disabled for showcase
                trapFocus={false}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <Sidebar />
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Flex>
      </Container>
    </Box>
  );
};
