import { ReactElement } from 'react';
import { Button } from '@chakra-ui/react';

import { User } from 'types/models/user';

import { UserProfile } from './UserProfile';

interface Props {
  user: User;
}

export const UserProfileButton = ({
  user,
}: Props): ReactElement<Props, typeof Button> => {
  return (
    <Button cursor="default" justifyContent="start" px={1} py={8} w={'100%'}>
      <UserProfile user={user} />
    </Button>
  );
};
