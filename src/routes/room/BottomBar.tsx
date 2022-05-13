import { ReactElement } from 'react';
import {
  Box,
  Button,
  Circle,
  Container,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { User } from 'types/models/user';

interface UserDisplayProps {
  user: User;
  color?: string;
}

const UserDisplay = ({
  user,
  color = 'white',
}: UserDisplayProps): ReactElement<UserDisplayProps, typeof HStack> => {
  return (
    <HStack spacing="2">
      <Circle bg={color} size="10px" />
      <Text fontSize="sm">{user.githubUsername}</Text>
    </HStack>
  );
};

interface Props {
  user: User;
  partner: User | null;
}

export const BottomBar = ({
  user,
  partner,
}: Props): ReactElement<Props, typeof Box> => {
  return (
    <Box
      as="footer"
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
    >
      <Container maxWidth="100%" px={2} py={2}>
        <HStack justify="space-between" spacing="10">
          <HStack spacing="4">
            <Button size="sm" variant="secondary">
              Execute Code
            </Button>
            <UserDisplay user={user} />
            {partner && <UserDisplay color="green" user={partner} />}
          </HStack>
          <Button colorScheme="red" size="sm">
            Close Room
          </Button>
        </HStack>
      </Container>
    </Box>
  );
};
