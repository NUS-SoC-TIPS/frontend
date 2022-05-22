import { ReactElement } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import {
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

import { Page } from 'components/page';

import { Card } from '../../components/card';

import { RoomButton } from './RoomButton';

/**
 * This component constitutes a few stateful components, namely the
 * room button, the stats panels and the past interview records.
 */
export const Interviews = (): ReactElement => {
  return (
    <Page>
      <Stack spacing={{ base: '8', lg: '6' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          justify="space-between"
          spacing="4"
        >
          <Stack spacing="1">
            <Heading
              fontWeight="medium"
              size={useBreakpointValue({ base: 'xs', lg: 'sm' })}
            >
              Interviews
            </Heading>
            <Text color="muted">Practice mock interviews with your peers!</Text>
          </Stack>
          <Stack direction="row" spacing="3">
            <Button
              leftIcon={<FiHelpCircle fontSize="1.25rem" />}
              variant="secondary"
            >
              Help
            </Button>
            <RoomButton />
          </Stack>
        </Stack>
        <Stack spacing={{ base: '5', lg: '6' }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
            <Card minH="3xs" />
            <Card minH="3xs" />
            <Card minH="3xs" />
          </SimpleGrid>
        </Stack>
        <Card minH="xs" />
      </Stack>
    </Page>
  );
};
