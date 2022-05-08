import { ReactElement } from 'react';
import {
  FiBarChart2,
  FiCheckSquare,
  FiHome,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi';
import { Divider, Flex, Stack, useColorModeValue } from '@chakra-ui/react';

import { INTERVIEWS, LEETCODE, SETTINGS, TASKS } from 'constants/routes';
import { User } from 'types/models/user';

import { Logo } from '../logo';
import { UserProfile } from '../userProfile';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import { NavButton } from './NavButton';

interface Props {
  user: User;
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
      flex="1"
      maxW={{ base: 'full', sm: 'xs' }}
      overflowY="auto"
      px={{ base: '4', sm: '6' }}
      py={{ base: '6', sm: '8' }}
    >
      <Stack justify="space-between" spacing="1" width="100%">
        <Stack shouldWrapChildren={true} spacing={{ base: '5', sm: '6' }}>
          <Logo pl={4} />
          <Stack spacing="2">
            <NavButton
              aria-current={pathname === INTERVIEWS ? 'page' : undefined}
              icon={FiHome}
              label="Interviews"
              onClick={(): void => navigate(INTERVIEWS)}
            />
            <NavButton
              aria-current={pathname === LEETCODE ? 'page' : undefined}
              icon={FiBarChart2}
              label="LeetCode"
              onClick={(): void => navigate(LEETCODE)}
            />
            <NavButton
              aria-current={pathname === TASKS ? 'page' : undefined}
              icon={FiCheckSquare}
              label="Tasks"
              onClick={(): void => navigate(TASKS)}
            />
          </Stack>
        </Stack>
        <Stack spacing={{ base: '5', sm: '6' }}>
          <Stack spacing="2">
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
