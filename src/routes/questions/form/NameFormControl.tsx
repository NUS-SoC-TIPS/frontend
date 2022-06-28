import { ReactElement, useState } from 'react';

import { FormControl } from 'components/formControl';
import { AsyncSelect } from 'components/select';
import { sourceToString } from 'constants/enumStrings';
import { Question } from 'types/models/question';

interface Props {
  questions: Question[];
  isLoading: boolean;
  isError: boolean;
  selectedQuestion: Question | null;
  onChange: (newValue: unknown) => void;
  defaultQuestion?: Question;
  isDisabled?: boolean;
}

// TODO: Write a custom component that combines react-select, virtualization and chakra-ui
// Until then, we will prevent the menu from showing too many options at once, as it lags.
const NUM_QUERIES_TO_SHOW = 50;

const questionToOption = (
  question: Question,
): { label: string; value: string } => {
  return {
    label: `${question.name} [${sourceToString[question.source]}]`,
    value: question.slug,
  };
};

export const NameFormControl = ({
  questions,
  isLoading,
  isError,
  selectedQuestion,
  onChange,
  defaultQuestion,
  isDisabled = false,
}: Props): ReactElement<Props, typeof FormControl> => {
  const [isSufficientlySpecific, setIsSufficientlySpecific] = useState(false);
  const questionOptions = questions.map(questionToOption);

  const onChangeWrapper = (newValue: unknown): void => {
    onChange(newValue);
    setIsSufficientlySpecific(false);
  };

  return (
    <FormControl id="name" label="Name">
      <AsyncSelect
        defaultOptions={
          selectedQuestion ? [questionToOption(selectedQuestion)] : []
        }
        defaultValue={
          defaultQuestion ? questionToOption(defaultQuestion) : undefined
        }
        isDisabled={isError || isDisabled}
        isLoading={isLoading}
        loadOptions={(inputValue, callback): void => {
          const options = questionOptions.filter((o) =>
            o.label.toLowerCase().includes(inputValue.toLowerCase()),
          );
          if (options.length > NUM_QUERIES_TO_SHOW) {
            setIsSufficientlySpecific(false);
            callback([]);
            return;
          }
          setIsSufficientlySpecific(true);
          callback(options);
        }}
        noOptionsMessage={
          isSufficientlySpecific
            ? 'No options found'
            : 'Please be more specific with your search query'
        }
        onChange={onChangeWrapper}
        placeholder="Search question name here..."
      />
    </FormControl>
  );
};
