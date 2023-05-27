import { ReactElement, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Stack, StackDivider, useToast } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { ADMIN, VIEW_COHORT } from 'constants/routes';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import { COURSEMOLOGY_COURSE_URL_PREFIX } from 'constants/urls';
import { createCohortAdmin } from 'lib/admin';

import { NameFormControl, UrlFormControl } from '../components/form';

interface State {
  name: string;
  coursemologyUrl: string;
  isAdding: boolean;
}

export const AddCohort = (): ReactElement<void, typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    {
      name: '',
      coursemologyUrl: '',
      isAdding: false,
    } as State,
  );
  const toast = useToast();
  const navigate = useNavigate();

  const cannotAdd = (): boolean => {
    return state.name.trim() === '' || state.coursemologyUrl.trim() === '';
  };

  const onAdd = (): Promise<void> => {
    setState({ isAdding: true });
    return createCohortAdmin({
      name: state.name,
      coursemologyUrl: COURSEMOLOGY_COURSE_URL_PREFIX + state.coursemologyUrl,
    })
      .then((data): void => {
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: 'Cohort added!',
          description: 'Redirecting you...',
          status: 'success',
        });
        setTimeout(() => navigate(`${VIEW_COHORT}/${data.id}`), 1000);
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({ isAdding: false });
      });
  };

  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={(): void => navigate(ADMIN)} variant="secondary">
            Back to Admin
          </Button>
        }
        heading="Add a Cohort"
        subheading="This will create a new cohort with no windows and no students."
      >
        <Stack divider={<StackDivider />} spacing={5}>
          <NameFormControl
            name={state.name}
            onChange={(name: string): void => setState({ name })}
          />
          <UrlFormControl
            onChange={(url: string): void => setState({ coursemologyUrl: url })}
            url={state.coursemologyUrl}
          />
          <Flex direction="row-reverse">
            <Button
              isDisabled={cannotAdd()}
              isLoading={state.isAdding}
              onClick={onAdd}
              variant="primary"
            >
              Add Cohort
            </Button>
          </Flex>
        </Stack>
      </Dashboard>
    </Page>
  );
};
