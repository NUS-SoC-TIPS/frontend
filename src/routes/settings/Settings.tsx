import { ReactElement, useReducer } from 'react';
import {
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';

import { Page } from 'components/page';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import { useUser } from 'contexts/UserContext';
import { updateSettings } from 'lib/users';

import { NameFormControl, PhotoFormControl } from './form';

interface State {
  name: string;
  photoUrl: string;
  isSaving: boolean;
}

export const Settings = (): ReactElement<typeof Page> => {
  const user = useUser();
  const toast = useToast();
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      name: user?.name ?? '',
      photoUrl: user?.photoUrl ?? '',
      isSaving: false,
    } as State,
  );

  const cannotSave = (): boolean => {
    return (
      state.name === '' ||
      state.photoUrl === '' ||
      (state.name === user?.name && state.photoUrl === user?.githubUsername)
    );
  };

  const onSave = async (): Promise<void> => {
    setState({ isSaving: true });
    return updateSettings({
      name: state.name,
      photoUrl: state.photoUrl,
    })
      .then((): void => {
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: 'Settings updated!',
          description: 'Reloading in one second...',
          status: 'success',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({ isSaving: false });
      });
  };

  return (
    <Page>
      <Stack spacing={5}>
        <Stack spacing={1}>
          <Heading
            fontWeight="medium"
            size={useBreakpointValue({ base: 'xs', lg: 'sm' })}
          >
            Settings
          </Heading>
          <Text color="muted">Customise your experience here at TIPS!</Text>
        </Stack>
        <Divider />
        <Stack divider={<StackDivider />} spacing={5}>
          <NameFormControl
            name={state.name}
            onChange={(name: string): void => setState({ name })}
          />
          <PhotoFormControl
            name={state.name}
            onChange={(photoUrl: string): void => setState({ photoUrl })}
            photoUrl={state.photoUrl}
          />
          <Flex direction="row-reverse">
            <Button
              isDisabled={cannotSave()}
              isLoading={state.isSaving}
              onClick={onSave}
              variant="primary"
            >
              Save Changes
            </Button>
          </Flex>
        </Stack>
      </Stack>
    </Page>
  );
};
