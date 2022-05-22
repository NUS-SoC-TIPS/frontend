import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

import { Page } from 'components/page';
import { ADD_QUESTION } from 'constants/routes';

import { Card } from '../../components/card';

/**
 * This component constitutes a few stateful components, namely the
 * room button, the stats panels and the past interview records.
 */
export const Questions = (): ReactElement<typeof Page> => {
  const navigate = useNavigate();
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
              Questions
            </Heading>
            <Text color="muted">
              Add your questions here once you have completed them!
            </Text>
          </Stack>
          <Stack direction="row" spacing="3">
            <Button
              onClick={(): void => navigate(ADD_QUESTION)}
              variant="primary"
            >
              Add Question
            </Button>
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
