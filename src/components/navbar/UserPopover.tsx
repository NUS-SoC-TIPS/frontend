import { ReactElement } from 'react';
import { FiLogOut, FiUser } from 'react-icons/fi';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Icon,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react';

import { User } from 'types/models/user';

import { UserProfile } from '../userProfile';

import { PopoverIcon } from './PopoverIcon';

interface Props {
  user: User;
  logout: () => void | Promise<void>;
}

export const UserPopover = ({
  user,
  logout,
}: Props): ReactElement<Props, typeof Popover> | null => {
  const items = [
    {
      title: 'GitHub Profile',
      onClick: () => window.open(user.profileUrl),
      icon: FiUser,
    },
    {
      title: 'Logout',
      onClick: logout,
      icon: FiLogOut,
    },
  ];

  return (
    <Popover gutter={12} openDelay={0} placement="bottom" trigger="hover">
      {({ isOpen }): ReactElement => (
        <>
          {/* @ts-expect-error: Prop types mismatch for children in React 18 */}
          <PopoverTrigger>
            <Button rightIcon={<PopoverIcon isOpen={isOpen} />} variant="link">
              <Avatar boxSize="10" name={user.name} src={user.photoUrl} />
            </Button>
          </PopoverTrigger>
          <PopoverContent p="5" width={{ base: 'xs' }}>
            <Stack direction="column" spacing="2">
              <Box mb="3">
                <UserProfile user={user} />
              </Box>
              <Divider />
              {items.map((item, id) => (
                <Link key={id} onClick={item.onClick} variant="menu">
                  <Stack direction="row" p="3" spacing="4">
                    <Icon as={item.icon} boxSize="6" color="accent" />
                    <Text fontWeight="medium">{item.title}</Text>
                  </Stack>
                </Link>
              ))}
            </Stack>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
