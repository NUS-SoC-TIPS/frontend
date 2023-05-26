import { ReactElement } from 'react';
import {
  FiAperture,
  FiBook,
  FiCheckSquare,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
} from 'react-icons/fi';
import { Divider, Flex, Stack, useColorModeValue } from '@chakra-ui/react';

import {
  ADD_COHORT,
  ADD_QUESTION,
  ADMIN,
  INTERVIEWS,
  PAST_INTERVIEW,
  PAST_SUBMISSION,
  QUESTIONS,
  SETTINGS,
  TASKS,
  TASKS_BREAKDOWN,
  VIEW_COHORT,
} from 'constants/routes';
import { UserSelf } from 'types/api/users';
import { UserRole } from 'types/models/user';

import { Logo } from '../logo';
import { UserProfile } from '../userProfile';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import { NavButton } from './NavButton';

interface Props {
  user: UserSelf;
  logout: () => void | Promise<void>;
  pathname: string;
  navigate: (path: string) => void;
}

export const Sidebar = ({
  user,
  logout,
  pathname,
  navigate,
}: Props): ReactElement<Props, typeof Flex> => (
  <Flex as="section" bg="bg-canvas" minH="100vh">
    <Flex
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
      flex={1}
      maxW={{ base: 'full', sm: 'xs' }}
      overflowY="auto"
      px={{ base: 4, sm: 6 }}
      py={{ base: 6, sm: 8 }}
    >
      <Stack justify="space-between" spacing={1} width="100%">
        <Stack shouldWrapChildren={true} spacing={{ base: 5, sm: 6 }}>
          <Logo pl={4} />
          <Stack spacing={2}>
            <NavButton
              aria-current={
                pathname === QUESTIONS ||
                pathname === ADD_QUESTION ||
                pathname.startsWith(PAST_SUBMISSION)
                  ? 'page'
                  : undefined
              }
              icon={FiBook}
              label="Questions"
              onClick={(): void => navigate(QUESTIONS)}
            />
            <NavButton
              aria-current={
                pathname === INTERVIEWS || pathname.startsWith(PAST_INTERVIEW)
                  ? 'page'
                  : undefined
              }
              icon={FiMessageSquare}
              label="Interviews"
              onClick={(): void => navigate(INTERVIEWS)}
            />
            {(user.isStudent || user.role === UserRole.ADMIN) && (
              <NavButton
                aria-current={
                  pathname === TASKS || pathname.startsWith(TASKS_BREAKDOWN)
                    ? 'page'
                    : undefined
                }
                icon={FiCheckSquare}
                label="Tasks"
                onClick={(): void => navigate(TASKS)}
              />
            )}
            {user.role === UserRole.ADMIN && (
              <NavButton
                aria-current={
                  pathname === ADMIN ||
                  pathname === ADD_COHORT ||
                  pathname.startsWith(VIEW_COHORT)
                    ? 'page'
                    : undefined
                }
                icon={FiAperture}
                label="Admin"
                onClick={(): void => navigate(ADMIN)}
              />
            )}
          </Stack>
        </Stack>
        <Stack spacing={{ base: 5, sm: 6 }}>
          <Stack spacing={2}>
            <ColorModeSwitcher isSideBar={true} />
            <NavButton
              aria-current={pathname === SETTINGS ? 'page' : undefined}
              icon={FiSettings}
              label="Settings"
              onClick={(): void => navigate(SETTINGS)}
            />
            <NavButton icon={FiLogOut} label="Logout" onClick={logout} />
          </Stack>
          <Divider />
          <UserProfile user={user} />
        </Stack>
      </Stack>
    </Flex>
  </Flex>
);
