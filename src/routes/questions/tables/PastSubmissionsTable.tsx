import { ReactElement, ReactNode, useMemo } from 'react';
import { Button } from '@chakra-ui/react';

import { Card } from 'components/card';
import { QuestionBox } from 'components/question';
import { Table } from 'components/table';
import { Language } from 'types/models/code';
import {
  Question,
  QuestionDifficulty,
  QuestionSource,
} from 'types/models/question';
import { SubmissionWithQuestion } from 'types/models/submission';
import { TableColumn } from 'types/table';
import { formatDate } from 'utils/dateUtils';
import {
  compareDatesAscending,
  compareDifficultiesEasyFirst,
  compareLanguagesAscending,
  compareNamesAscending,
} from 'utils/sortUtils';
import {
  difficultyRenderer,
  languageRenderer,
  sourceRenderer,
} from 'utils/tableUtils';

interface Props {
  submissions: SubmissionWithQuestion[];
  onView: (id: number) => void;
}

interface Row {
  id: number;
  question: Question;
  source: QuestionSource;
  createdAt: Date;
  difficulty: QuestionDifficulty;
  languageUsed: Language;
}

const getColumns = (onView: (id: number) => void): TableColumn[] => {
  return [
    {
      label: 'Question',
      key: 'question',
      options: {
        customBodyRenderer: (question: Question): ReactNode => (
          <QuestionBox
            question={question}
            withBox={false}
            withDifficulty={false}
          />
        ),
        customSearchValueRenderer: (question: Question) => question.name,
        customCsvBodyRenderer: (question: Question) => question.name,
        customSortComparator: compareNamesAscending,
        isSortable: true,
      },
    },
    {
      label: 'Source',
      key: 'source',
      options: {
        isVisible: false,
        customCsvBodyRenderer: sourceRenderer,
        customSearchValueRenderer: sourceRenderer,
      },
    },
    {
      label: 'Submitted On',
      key: 'createdAt',
      options: {
        customBodyRenderer: formatDate,
        customSearchValueRenderer: formatDate,
        customCsvBodyRenderer: formatDate,
        isSortable: true,
        customSortComparator: compareDatesAscending,
      },
    },
    {
      label: 'Difficulty',
      key: 'difficulty',
      options: {
        customBodyRenderer: difficultyRenderer,
        customSearchValueRenderer: difficultyRenderer,
        customCsvBodyRenderer: difficultyRenderer,
        customSortComparator: compareDifficultiesEasyFirst,
        isSortable: true,
      },
    },
    {
      label: 'Language',
      key: 'languageUsed',
      options: {
        customBodyRenderer: languageRenderer,
        customSearchValueRenderer: languageRenderer,
        customCsvBodyRenderer: languageRenderer,
        customSortComparator: compareLanguagesAscending,
        isSortable: true,
      },
    },
    {
      label: 'Action',
      key: 'id',
      options: {
        customBodyRenderer: (id: number): ReactNode => (
          <Button onClick={(): void => onView(id)} variant="secondary">
            View
          </Button>
        ),
        isDownloadable: false,
        isSearchable: false,
      },
    },
  ];
};

const transformData = (submissions: SubmissionWithQuestion[]): Row[] => {
  return submissions.map((submission) => ({
    id: submission.id,
    question: submission.question,
    createdAt: submission.createdAt,
    difficulty: submission.question.difficulty,
    source: submission.question.source,
    languageUsed: submission.languageUsed,
  }));
};

export const PastSubmissionsTable = ({
  submissions,
  onView,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(onView), [onView]);
  const rows = useMemo(() => transformData(submissions), [submissions]);
  return (
    <Card px={0} py={0}>
      <Table
        columns={columns}
        options={{ isDownloadable: false, title: 'Past Submissions' }}
        rows={rows}
      />
    </Card>
  );
};
