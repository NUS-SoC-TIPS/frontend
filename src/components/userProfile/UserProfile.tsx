import * as React from 'react';
import { Avatar, Box, HStack, Text } from '@chakra-ui/react';

import { User } from 'types/models/user';

interface Props {
  user: User;
}

export const UserProfile = ({
  user,
}: Props): React.ReactElement<Props, typeof HStack> => {
  return (
    <HStack ps="2" spacing="3">
      <Avatar boxSize="10" name={user.name} src={user.photoUrl} />
      <Box>
        <Text fontSize="sm" fontWeight="medium" textAlign="left">
          {user.name}
        </Text>
        <Text color="muted" fontSize="sm" textAlign="left">
          {user.githubUsername}
        </Text>
      </Box>
    </HStack>
  );
};
