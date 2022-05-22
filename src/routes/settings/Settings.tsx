import { ReactElement, useReducer } from 'react';
import {
  Divider,
  Heading,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

import { Page } from 'components/page';
import { useUser } from 'contexts/UserContext';

import { NameFormControl } from './form/NameFormControl';
import { PhotoFormControl } from './form/PhotoFormControl';

interface State {
  name: string;
  photoUrl: string;
}

export const Settings = (): ReactElement<typeof Page> => {
  const user = useUser();
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      name: user?.name ?? '',
      photoUrl: user?.photoUrl ?? '',
    } as State,
  );

  return (
    <Page>
      <Stack spacing="5">
        <Stack spacing="1">
          <Heading
            fontWeight="medium"
            size={useBreakpointValue({ base: 'xs', lg: 'sm' })}
          >
            Settings
          </Heading>
          <Text color="muted">Customise your experience here at TIPS!</Text>
        </Stack>
        <Divider />
        <Stack divider={<StackDivider />} spacing="5">
          <NameFormControl
            name={state.name}
            onChange={(name: string): void => setState({ name })}
          />
          <PhotoFormControl
            name={state.name}
            onChange={(photoUrl: string): void => setState({ photoUrl })}
            photoUrl={state.photoUrl}
          />
        </Stack>
      </Stack>
    </Page>
  );
};
