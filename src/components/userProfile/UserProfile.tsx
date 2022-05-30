import { memo, ReactElement } from 'react';
import { Avatar, Box, HStack, Link, Text } from '@chakra-ui/react';

import { User } from 'types/models/user';

interface Props {
  user: User;
}

const RawUserProfile = ({
  user,
}: Props): ReactElement<Props, typeof HStack> => {
  return (
    <HStack ps={2} spacing={3}>
      <Avatar boxSize={10} name={user.name} src={user.photoUrl} />
      <Box>
        <Link
          fontSize="sm"
          fontWeight="medium"
          href={user.profileUrl}
          isExternal={true}
          textAlign="left"
        >
          {user.name}
        </Link>
        <Text color="muted" fontSize="sm" textAlign="left">
          {user.githubUsername}
        </Text>
      </Box>
    </HStack>
  );
};

const propsAreEqual = (prevProps: Props, nextProps: Props): boolean => {
  return (
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.photoUrl === nextProps.user.photoUrl &&
    prevProps.user.githubUsername === nextProps.user.githubUsername
  );
};

export const UserProfile = memo(RawUserProfile, propsAreEqual);
