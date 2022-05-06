import * as React from 'react';
import { Avatar, Box, HStack, Text } from '@chakra-ui/react';

interface UserProfileProps {
  name: string;
  image: string;
  email: string;
}

export const UserProfile = (props: UserProfileProps): React.ReactElement => {
  const { name, image, email } = props;
  return (
    <HStack ps="2" spacing="3">
      <Avatar boxSize="10" name={name} src={image} />
      <Box>
        <Text fontSize="sm" fontWeight="medium">
          {name}
        </Text>
        <Text color="muted" fontSize="sm">
          {email}
        </Text>
      </Box>
    </HStack>
  );
};
