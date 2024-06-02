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
  ADD_QUESTION,
  ADMIN,
  INTERVIEWS,
  PAST_INTERVIEW,
  PAST_SUBMISSION,
  QUESTIONS,
  SETTINGS,
  TASKS,
  TASKS_BREAKDOWN,
} from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/models/user';

import { Logo } from '../logo';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Sidebar } from './Sidebar';
import { ToggleButton } from './ToggleButton';
import { UserPopover } from './UserPopover';

export const Navbar = (): ReactElement<typeof Box> => {
  const isDesktop = useBreakpointValue(
    { base: false, lg: true },
    { ssr: false },
  );
  const { isOpen, onToggle, onClose } = useDisclosure();
  const user = useUser();
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggingIn, login } = useAuth();

  const isOnQuestionTab =
    pathname === QUESTIONS ||
    pathname === ADD_QUESTION ||
    pathname.startsWith(PAST_SUBMISSION);
  const isOnInterviewsTab =
    pathname === INTERVIEWS || pathname.startsWith(PAST_INTERVIEW);
  const isOnTasksTab =
    pathname === TASKS || pathname.startsWith(TASKS_BREAKDOWN);
  const isOnAdminTab = pathname.startsWith(ADMIN);
  const isOnSettingsTab = pathname === SETTINGS;

  return (
    <Box
      as="nav"
      bg="bg.surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
    >
      <Container maxW="8xl" py={{ base: 3, lg: 4 }}>
        <Flex justify="space-between">
          <HStack spacing={4}>
            <Logo />
            {isDesktop && user && (
              <ButtonGroup spacing={2} variant="secondary">
                <Button
                  aria-current={isOnQuestionTab ? 'page' : undefined}
                  border="none"
                  isActive={isOnQuestionTab}
                  onClick={(): void => navigate(QUESTIONS)}
                >
                  Questions
                </Button>
                <Button
                  aria-current={isOnInterviewsTab ? 'page' : undefined}
                  border="none"
                  isActive={isOnInterviewsTab}
                  onClick={(): void => navigate(INTERVIEWS)}
                >
                  Interviews
                </Button>
                {(user.isStudent || user.role === UserRole.ADMIN) && (
                  <Button
                    aria-current={isOnTasksTab ? 'page' : undefined}
                    border="none"
                    isActive={isOnTasksTab}
                    onClick={(): void => navigate(TASKS)}
                  >
                    Tasks
                  </Button>
                )}
                {user.role === UserRole.ADMIN && (
                  <Button
                    aria-current={isOnAdminTab ? 'page' : undefined}
                    border="none"
                    isActive={isOnAdminTab}
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
                  <ButtonGroup spacing={2} variant="secondary">
                    <ColorModeSwitcher border="none" isSideBar={false} />
                    <IconButton
                      aria-current={isOnSettingsTab ? 'page' : undefined}
                      aria-label="Settings"
                      border="none"
                      icon={<FiSettings fontSize="1.25rem" />}
                      isActive={isOnSettingsTab}
                      onClick={(): void => navigate(SETTINGS)}
                    />
                  </ButtonGroup>
                  <UserPopover user={user} />
                </>
              ) : (
                <ButtonGroup spacing={2}>
                  <ColorModeSwitcher
                    border="none"
                    isSideBar={false}
                    variant="secondary"
                  />
                  <Button
                    isLoading={isLoggingIn}
                    onClick={login}
                    variant="primary"
                  >
                    Log in
                  </Button>
                </ButtonGroup>
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
                    isOnAdminTab={isOnAdminTab}
                    isOnInterviewsTab={isOnInterviewsTab}
                    isOnQuestionTab={isOnQuestionTab}
                    isOnSettingsTab={isOnSettingsTab}
                    isOnTasksTab={isOnTasksTab}
                    logout={logout}
                    navigate={navigate}
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
