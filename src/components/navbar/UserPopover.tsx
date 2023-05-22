import { memo, ReactElement } from 'react';
import { FiLogOut } from 'react-icons/fi';
import {
  Avatar,
  Box,
  Divider,
  Icon,
  Link,
  Popover,
  Stack,
  Text,
} from '@chakra-ui/react';

import { MyPopover } from 'components/popover';
import { useAuth } from 'contexts/AuthContext';
import { UserSelf } from 'types/api/users';

import { UserProfile } from '../userProfile';

interface Props {
  user: UserSelf;
}

const RawUserPopover = ({
  user,
}: Props): ReactElement<Props, typeof Popover> | null => {
  const { logout } = useAuth();
  const items = [
    {
      title: 'Logout',
      onClick: logout,
      icon: FiLogOut,
    },
  ];

  return (
    <MyPopover
      buttonProps={{ variant: 'link' }}
      content={
        <Stack direction="column" spacing={2}>
          <Box mb={3}>
            <UserProfile user={user} />
          </Box>
          <Divider />
          {items.map((item, id) => (
            <Link key={id} onClick={item.onClick} variant="menu">
              <Stack direction="row" p={3} spacing={4}>
                <Icon as={item.icon} boxSize={6} color="accent" />
                <Text fontWeight="medium">{item.title}</Text>
              </Stack>
            </Link>
          ))}
        </Stack>
      }
      popoverContentProps={{ p: 5, width: { base: 'xs' } }}
      trigger={<Avatar boxSize={10} name={user.name} src={user.photoUrl} />}
    />
  );
};

export const UserPopover = memo(RawUserPopover, (prevProps, newProps) => {
  return (
    prevProps.user.name === newProps.user.name &&
    prevProps.user.photoUrl === newProps.user.photoUrl &&
    prevProps.user.githubUsername === newProps.user.githubUsername // This is for UserProfile
  );
});
