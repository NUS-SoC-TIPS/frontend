import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { UserProfile } from 'components/userProfile';
import { User } from 'types/models/user';

interface Props {
  partner: User | null;
}

export const LatestPartnerCard = ({
  partner,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <Card>
      <Stack>
        <Text color="muted" fontSize="sm">
          Latest Partner
        </Text>
        {partner ? (
          <UserProfile ps={0} user={partner} />
        ) : (
          <Heading size="sm">-</Heading>
        )}
      </Stack>
    </Card>
  );
};
