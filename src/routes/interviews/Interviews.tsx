import { ReactElement } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import { Button, SimpleGrid, Stack } from '@chakra-ui/react';

import { Banner } from 'components/banner';
import { Dashboard, Page } from 'components/page';
import { ARE_INTERVIEWS_ENABLED } from 'constants/app';

import { Card } from '../../components/card';

import { RoomButton } from './RoomButton';

/**
 * This component constitutes a few stateful components, namely the
 * room button, the stats panels and the past interview records.
 */
export const Interviews = (): ReactElement => {
  return (
    <Page>
      <Dashboard
        actions={
          ARE_INTERVIEWS_ENABLED ? (
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
        {ARE_INTERVIEWS_ENABLED ? (
          <Stack spacing={{ base: 5, lg: 6 }}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <Card minH="3xs" />
              <Card minH="3xs" />
              <Card minH="3xs" />
            </SimpleGrid>
            <Card minH="xs" />
          </Stack>
        ) : (
          <Card>
            <Banner
              message="We'll be starting on mock interviews in Week 3!"
              title="Coming soon."
            />
          </Card>
        )}
      </Dashboard>
    </Page>
  );
};
