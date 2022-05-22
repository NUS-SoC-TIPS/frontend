import { ReactElement, useState } from 'react';
import { FormControl, FormLabel, Stack } from '@chakra-ui/react';

import { AsyncSelect } from 'components/select';
import { Question } from 'types/models/question';

interface Props {
  questions: Question[];
  isLoading: boolean;
  isError: boolean;
  selectedQuestion: Question | null;
  onChange: (newValue: unknown) => void;
}

// TODO: Write a custom component that combines react-select, virtualization and chakra-ui
// Until then, we will prevent the menu from showing too many options at once, as it lags.
const NUM_QUERIES_TO_SHOW = 50;

export const NameFormControl = ({
  questions,
  isLoading,
  isError,
  selectedQuestion,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  const [isSufficientlySpecific, setIsSufficientlySpecific] = useState(false);

  const onChangeWrapper = (newValue: unknown): void => {
    onChange(newValue);
    setIsSufficientlySpecific(false);
  };

  return (
    <FormControl id="name">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: '1.5', md: '8' }}
      >
        <FormLabel variant="inline">Name</FormLabel>
        <AsyncSelect
          containerStyles={{ maxW: { md: '3xl' } }}
          defaultOptions={
            selectedQuestion
              ? [
                  {
                    label: selectedQuestion.name,
                    value: selectedQuestion.slug,
                  },
                ]
              : []
          }
          isDisabled={isError}
          isLoading={isLoading}
          loadOptions={(inputValue, callback): void => {
            const values = questions.filter((q) =>
              q.name.toLowerCase().includes(inputValue.toLowerCase()),
            );
            if (values.length > NUM_QUERIES_TO_SHOW) {
              setIsSufficientlySpecific(false);
              callback([]);
              return;
            }
            const options = values.map((q) => ({
              value: q.slug,
              label: q.name,
            }));
            setIsSufficientlySpecific(true);
            callback(options);
          }}
          noOptionsMessage={
            isSufficientlySpecific
              ? 'No options found'
              : 'Please be more specific with your search query'
          }
          onChange={onChangeWrapper}
          placeholder="Search using the question name here..."
        />
      </Stack>
    </FormControl>
  );
};
