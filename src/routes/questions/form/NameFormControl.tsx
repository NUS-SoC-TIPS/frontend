import { ReactElement, useCallback, useMemo, useState } from 'react';

import { FormControl } from 'components/formControl';
import { AsyncSelect } from 'components/select';
import { SOURCE_TO_STRING } from 'constants/enumStrings';
import { QuestionSource } from 'types/models/question';

interface Props {
  questions: { name: string; source: QuestionSource; slug: string }[];
  isLoading: boolean;
  isError: boolean;
  selectedQuestion: {
    name: string;
    source: QuestionSource;
    slug: string;
  } | null;
  onChange: (newValue: unknown) => void;
  defaultQuestion?: { name: string; source: QuestionSource; slug: string };
  isDisabled?: boolean;
}

// TODO: Write a custom component that combines react-select, virtualization and chakra-ui
// Until then, we will prevent the menu from showing too many options at once, as it lags.
const NUM_QUERIES_TO_SHOW = 50;

const questionToOption = (question: {
  name: string;
  source: QuestionSource;
  slug: string;
}): { label: string; value: string } => {
  return {
    label: `${question.name} [${SOURCE_TO_STRING[question.source]}]`,
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
  const questionOptions = useMemo(
    () => questions.map(questionToOption),
    [questions],
  );

  const onChangeWrapper = useCallback(
    (newValue: unknown): void => {
      onChange(newValue);
      setIsSufficientlySpecific(false);
    },
    [onChange],
  );

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
