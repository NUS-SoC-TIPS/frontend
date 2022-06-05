import { memo, ReactElement } from 'react';
import { Avatar, Box, HStack, Link, StackProps, Text } from '@chakra-ui/react';

import { User } from 'types/models/user';

interface Props extends StackProps {
  user: User;
}

const RawUserProfile = ({
  user,
  ...props
}: Props): ReactElement<Props, typeof HStack> => {
  const finalProps = {
    ps: 2,
    spacing: 3,
    ...props,
  };
  return (
    <HStack {...finalProps}>
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
