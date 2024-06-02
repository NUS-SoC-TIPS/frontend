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
  ADMIN,
  INTERVIEWS,
  QUESTIONS,
  SETTINGS,
  TASKS,
} from '@/constants/routes';
import { UserSelf } from '@/types/api/users';
import { UserRole } from '@/types/models/user';

import { Logo } from '../logo';
import { UserProfile } from '../userProfile';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import { NavButton } from './NavButton';

interface Props {
  user: UserSelf;
  logout: () => void | Promise<void>;
  isOnQuestionTab: boolean;
  isOnInterviewsTab: boolean;
  isOnTasksTab: boolean;
  isOnAdminTab: boolean;
  isOnSettingsTab: boolean;
  navigate: (path: string) => void;
}

export const Sidebar = ({
  user,
  logout,
  isOnQuestionTab,
  isOnInterviewsTab,
  isOnTasksTab,
  isOnAdminTab,
  isOnSettingsTab,
  navigate,
}: Props): ReactElement<Props, typeof Flex> => (
  <Flex as="section" bg="bg.canvas" minH="100vh">
    <Flex
      bg="bg.surface"
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
              aria-current={isOnQuestionTab ? 'page' : undefined}
              icon={FiBook}
              isActive={isOnQuestionTab}
              label="Questions"
              onClick={(): void => navigate(QUESTIONS)}
            />
            <NavButton
              aria-current={isOnInterviewsTab ? 'page' : undefined}
              icon={FiMessageSquare}
              isActive={isOnInterviewsTab}
              label="Interviews"
              onClick={(): void => navigate(INTERVIEWS)}
            />
            {(user.isStudent || user.role === UserRole.ADMIN) && (
              <NavButton
                aria-current={isOnTasksTab ? 'page' : undefined}
                icon={FiCheckSquare}
                isActive={isOnTasksTab}
                label="Tasks"
                onClick={(): void => navigate(TASKS)}
              />
            )}
            {user.role === UserRole.ADMIN && (
              <NavButton
                aria-current={isOnAdminTab ? 'page' : undefined}
                icon={FiAperture}
                isActive={isOnAdminTab}
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
              aria-current={isOnSettingsTab ? 'page' : undefined}
              icon={FiSettings}
              isActive={isOnSettingsTab}
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
