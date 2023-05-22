import { memo, ReactElement } from 'react';
import { Avatar, Box, HStack, Link, StackProps, Text } from '@chakra-ui/react';

import { UserBase } from 'types/api/users';

interface Props extends StackProps {
  user: UserBase;
  noOfLines?: number;
}

const RawUserProfile = ({
  user,
  noOfLines = 1,
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
        <Text
          color="emphasized"
          fontSize="sm"
          fontWeight="medium"
          noOfLines={noOfLines}
          textAlign="left"
        >
          {user.name}
        </Text>
        <Link
          color="muted"
          fontSize="sm"
          href={user.profileUrl}
          isExternal={true}
          noOfLines={1}
          textAlign="left"
        >
          {user.githubUsername}
        </Link>
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
