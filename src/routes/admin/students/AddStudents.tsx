import { ReactElement, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Code, Flex, Stack, Text, useToast } from '@chakra-ui/react';

import { JsonDropzone } from '@/components/dropzone/JsonDropzone';
import { Dashboard, Page } from '@/components/page';
import { VIEW_COHORT } from '@/constants/routes';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from '@/constants/toast';
import { createStudentsAdmin, validateStudentsAdmin } from '@/lib/admin';
import { CohortStudentValidationResult } from '@/types/api/admin';

import {
  CreatedStudentTable,
  ErrorStudentTable,
  UploadedDataTable,
} from './tables';

interface State {
  studentsToCreate: {
    githubUsername: string;
    coursemologyName: string;
    coursemologyProfileUrl: string;
  }[];
  validationResult: CohortStudentValidationResult | null;
  creationResult: CohortStudentValidationResult | null;
  isValidating: boolean;
  isCreating: boolean;
}

const sampleJson = [
  '[',
  '  {',
  '    "githubUsername": "zhuhanming",',
  '    "coursemologyName": "Zhu Hanming",',
  '    "coursemologyProfileUrl": "https://coursemology.org/courses/2555/users/80723"',
  '  }',
  ']',
];

export const AddStudents = (): ReactElement<void, typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    {
      studentsToCreate: [],
      validationResult: null,
      creationResult: null,
      isValidating: false,
      isCreating: false,
    } as State,
  );

  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const onUpload = (data: unknown): void => {
    try {
      if (!Array.isArray(data)) {
        throw new Error('Invalid data!');
      }
      data.forEach((student) => {
        if (
          !('githubUsername' in student) ||
          typeof student.githubUsername !== 'string'
        ) {
          throw new Error('Missing or invalid GitHub username!');
        }
        if (
          !('coursemologyName' in student) ||
          typeof student.coursemologyName !== 'string'
        ) {
          throw new Error('Missing or invalid Coursemology Name!');
        }
        if (
          !('coursemologyProfileUrl' in student) ||
          typeof student.coursemologyProfileUrl !== 'string'
        ) {
          throw new Error('Missing or invalid Coursemology Profile URL!');
        }
      });
      setState({
        studentsToCreate: data,
        validationResult: null,
        creationResult: null,
      });
    } catch (e) {
      if (e instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(e.message);
      }
      toast(ERROR_TOAST_PROPS);
    }
  };

  const onValidate = (): Promise<void> => {
    if (id == null) {
      return Promise.resolve();
    }
    setState({ isValidating: true });
    return validateStudentsAdmin(+id, state.studentsToCreate)
      .then((data): void => {
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: 'Validation complete!',
          description: 'Scroll down to see the results.',
          status: 'success',
        });
        setState({
          isValidating: false,
          validationResult: data,
          creationResult: null,
        });
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({ isValidating: false });
      });
  };

  const onAdd = (): Promise<void> => {
    if (id == null) {
      return Promise.resolve();
    }
    setState({ isCreating: true });
    return createStudentsAdmin(+id, state.studentsToCreate)
      .then((data): void => {
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: 'Creation complete!',
          description: 'Table has been updated with the creation results.',
          status: 'success',
        });
        setState({
          isCreating: false,
          validationResult: null,
          creationResult: data,
        });
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({ isCreating: false });
      });
  };

  const resultToRender = state.creationResult ?? state.validationResult ?? null;

  return (
    <Page>
      <Dashboard
        actions={
          <Button
            onClick={(): void => navigate(`${VIEW_COHORT}/${id}`)}
            variant="secondary"
          >
            Back to Cohort
          </Button>
        }
        heading="Add Students"
        subheading="This will add new students to the cohort."
      >
        <Stack spacing={8}>
          <Stack spacing={3}>
            <Stack spacing={2}>
              <Text>
                Start by uploading a JSON file in the following format:
              </Text>
              <Code whiteSpace="pre-wrap" width="100%" wordBreak="break-all">
                {sampleJson.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </Code>
            </Stack>
            <JsonDropzone onChange={onUpload} />
          </Stack>
          {state.studentsToCreate.length > 0 && (
            <>
              <Stack spacing={2}>
                <Text>
                  Review your uploaded data here in this table. To make changes
                  to this table, please reupload a modified JSON file.
                </Text>
                <UploadedDataTable data={state.studentsToCreate} />
              </Stack>
              <Stack spacing={2}>
                <Text>
                  Once you are good with the data above, validate it once more
                  by clicking the below button. Note that there will be no
                  actual creation at this point, it will just be a sanity check
                  against the existing data.
                </Text>
                <Flex direction="row-reverse">
                  <Button
                    isDisabled={
                      state.isCreating || state.studentsToCreate.length === 0
                    }
                    isLoading={state.isValidating}
                    onClick={onValidate}
                    variant="primary"
                  >
                    Validate Uploaded Data
                  </Button>
                </Flex>
              </Stack>
            </>
          )}
          {resultToRender != null && (
            <>
              <Stack spacing={5}>
                <CreatedStudentTable
                  isCreated={state.creationResult != null}
                  students={resultToRender.success}
                />
                <ErrorStudentTable
                  isCreated={state.creationResult != null}
                  students={resultToRender.error}
                />
              </Stack>
              <Stack spacing={2}>
                <Text>
                  Check the above validation results carefully before clicking
                  the following button to add the students. Students in the
                  &apos;Cannot Add&apos; table will not be added.
                </Text>
                <Flex direction="row-reverse">
                  <Button
                    isDisabled={
                      state.validationResult == null ||
                      state.validationResult.success.length === 0
                    }
                    isLoading={state.isCreating}
                    onClick={onAdd}
                    variant="primary"
                  >
                    Add Students
                  </Button>
                </Flex>
              </Stack>
            </>
          )}
        </Stack>
      </Dashboard>
    </Page>
  );
};
