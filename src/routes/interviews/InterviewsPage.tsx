import { PropsWithChildren, ReactElement } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import { Button, Stack } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { useUser } from 'contexts/UserContext';
import { UserRole } from 'types/models/user';

import { RoomButton } from './RoomButton';

export const InterviewsPage = ({
  children,
}: PropsWithChildren<unknown>): ReactElement<
  PropsWithChildren<unknown>,
  typeof Page
> => {
  const user = useUser();

  return (
    <Page>
      <Dashboard
        actions={
          user?.role === UserRole.ADMIN ? (
            <Stack direction="row" spacing={3}>
              <Button
                leftIcon={<FiHelpCircle fontSize="1.25rem" />}
                variant="secondary"
              >
                Help
              </Button>
              <RoomButton />
            </Stack>
          ) : null
        }
        heading="Interviews"
        subheading="Practice mock interviews with your peers!"
      >
        {children}
      </Dashboard>
    </Page>
  );
};
