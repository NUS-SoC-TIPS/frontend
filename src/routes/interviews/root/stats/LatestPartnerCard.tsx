import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { UserProfile } from 'components/userProfile';
import { UserBase } from 'types/api/users';

interface Props {
  partner: UserBase | null;
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
