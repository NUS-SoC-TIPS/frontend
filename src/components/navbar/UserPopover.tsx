import { ReactElement } from 'react';
import { FiBookOpen, FiLogOut } from 'react-icons/fi';
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
import { UserSettingsConfig } from 'types/models/user';

import { UserProfile } from '../userProfile';

interface Props {
  user: UserSettingsConfig;
  logout: () => void | Promise<void>;
}

export const UserPopover = ({
  user,
  logout,
}: Props): ReactElement<Props, typeof Popover> | null => {
  const items = [
    {
      title: 'Coursemology',
      onClick: () => window.open(user.config.coursemology),
      icon: FiBookOpen,
    },
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
      }
      popoverContentProps={{ p: '5', width: { base: 'xs' } }}
      trigger={<Avatar boxSize="10" name={user.name} src={user.photoUrl} />}
    />
  );
};
