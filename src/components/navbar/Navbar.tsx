import { ReactElement } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import {
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

import {
  ADMIN,
  INTERVIEWS,
  QUESTIONS,
  SETTINGS,
  TASKS,
} from 'constants/routes';
import { useAuth } from 'contexts/AuthContext';
import { useUser } from 'contexts/UserContext';
import { UserRole } from 'types/models/user';

import { Logo } from '../logo';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Sidebar } from './Sidebar';
import { ToggleButton } from './ToggleButton';
import { UserPopover } from './UserPopover';

export const Navbar = (): ReactElement<typeof Box> => {
  const isDesktop = useBreakpointValue(
    { base: false, lg: true },
    { fallback: 'lg' },
  );
  const { isOpen, onToggle, onClose } = useDisclosure();
  const user = useUser();
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggingIn, login } = useAuth();

  return (
    <Box
      as="nav"
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
    >
      <Container maxW="8xl" py={{ base: 3, lg: 4 }}>
        <Flex justify="space-between">
          <HStack spacing={4}>
            <Logo />
            {isDesktop && user && (
              <ButtonGroup spacing={1} variant="ghost">
                <Button
                  aria-current={pathname === QUESTIONS ? 'page' : undefined}
                  onClick={(): void => navigate(QUESTIONS)}
                >
                  Questions
                </Button>
                <Button
                  aria-current={pathname === INTERVIEWS ? 'page' : undefined}
                  onClick={(): void => navigate(INTERVIEWS)}
                >
                  Interviews
                </Button>
                <Button
                  aria-current={pathname === TASKS ? 'page' : undefined}
                  onClick={(): void => navigate(TASKS)}
                >
                  Tasks
                </Button>
                {user.role === UserRole.ADMIN && (
                  <Button
                    aria-current={pathname === ADMIN ? 'page' : undefined}
                    onClick={(): void => navigate(ADMIN)}
                  >
                    Admin
                  </Button>
                )}
              </ButtonGroup>
            )}
          </HStack>
          {isDesktop || !user ? (
            <HStack spacing={4}>
              {user ? (
                <>
                  <ButtonGroup spacing={1} variant="ghost">
                    <ColorModeSwitcher isSideBar={false} />
                    <IconButton
                      aria-current={pathname === SETTINGS ? 'page' : undefined}
                      aria-label="Settings"
                      icon={<FiSettings fontSize="1.25rem" />}
                      onClick={(): void => navigate(SETTINGS)}
                    />
                  </ButtonGroup>
                  <UserPopover logout={logout} user={user} />
                </>
              ) : (
                <>
                  <ColorModeSwitcher isSideBar={false} />
                  <Button
                    isLoading={isLoggingIn}
                    onClick={login}
                    variant="primary"
                  >
                    Log in
                  </Button>
                </>
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
              >
                <DrawerOverlay />
                <DrawerContent>
                  <Sidebar
                    logout={logout}
                    navigate={navigate}
                    pathname={pathname}
                    user={user}
                  />
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Flex>
      </Container>
    </Box>
  );
};
