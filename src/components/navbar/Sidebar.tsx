import { ReactElement } from 'react';
import {
  FiBarChart2,
  FiBookmark,
  FiCheckSquare,
  FiHelpCircle,
  FiHome,
  FiSearch,
  FiSettings,
  FiUsers,
} from 'react-icons/fi';
// import { Icon } from '@chakra-ui/icons';
import {
  Divider,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

import { Logo } from './Logo';
import { NavButton } from './NavButton';
import { UserProfile } from './UserProfile';

export const Sidebar = (): ReactElement<typeof Flex> => (
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
      <Stack justify="space-between" spacing="1">
        <Stack shouldWrapChildren={true} spacing={{ base: '5', sm: '6' }}>
          <Logo />
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} boxSize="5" color="muted" />
            </InputLeftElement>
            <Input placeholder="Search" />
          </InputGroup>
          <Stack spacing="1">
            <NavButton icon={FiHome} label="Home" />
            <NavButton
              aria-current="page"
              icon={FiBarChart2}
              label="Dashboard"
            />
            <NavButton icon={FiCheckSquare} label="Tasks" />
            <NavButton icon={FiBookmark} label="Bookmarks" />
            <NavButton icon={FiUsers} label="Users" />
          </Stack>
        </Stack>
        <Stack spacing={{ base: '5', sm: '6' }}>
          <Stack spacing="1">
            <NavButton icon={FiHelpCircle} label="Help" />
            <NavButton icon={FiSettings} label="Settings" />
          </Stack>
          <Divider />
          <UserProfile
            email="chris@chakra-ui.com"
            image="https://tinyurl.com/yhkm2ek8"
            name="Christoph Winston"
          />
        </Stack>
      </Stack>
    </Flex>
  </Flex>
);
