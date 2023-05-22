import { ReactElement } from 'react';
import { Box } from '@chakra-ui/react';

import { UserBase } from 'types/api/users';

import { UserProfile } from './UserProfile';

interface Props {
  user: UserBase;
}

export const UserProfileHighlight = ({
  user,
}: Props): ReactElement<Props, typeof Box> => {
  return (
    <Box
      _hover={{ bg: 'whiteAlpha.300' }}
      bg="whiteAlpha.200"
      borderRadius="lg"
      p={3}
    >
      <UserProfile ps={0} user={user} />
    </Box>
  );
};
