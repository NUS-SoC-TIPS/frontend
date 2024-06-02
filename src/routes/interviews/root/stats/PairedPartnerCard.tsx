import { ReactElement } from 'react';
import { Heading, Link, Stack, Text } from '@chakra-ui/react';

import { Card } from '@/components/card';
import { UserProfile } from '@/components/userProfile';
import { StudentBase } from '@/types/api/students';

interface Props {
  partner: StudentBase | null;
}

export const PairedPartnerCard = ({
  partner,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <Card>
      <Stack>
        <Text color="fg.muted" fontSize="sm">
          Paired Partner
        </Text>
        {partner ? (
          <Stack spacing={3}>
            <UserProfile ps={0} user={partner} />
            <Link
              color="fg.muted"
              fontWeight="medium"
              href={partner.coursemologyProfileUrl}
              isExternal={true}
              textAlign="left"
            >
              View their profile on Coursemology
            </Link>
          </Stack>
        ) : (
          <Heading size="sm">-</Heading>
        )}
      </Stack>
    </Card>
  );
};
