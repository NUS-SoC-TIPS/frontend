import { ReactElement, ReactNode, useMemo } from 'react';
import { Button, Link } from '@chakra-ui/react';

import { Card } from 'components/card';
import { QuestionBox } from 'components/question';
import { Table } from 'components/table';
import { PAST_SUBMISSION } from 'constants/routes';
import { QuestionBase, SubmissionListItem } from 'types/api/questions';
import { Language } from 'types/models/code';
import { QuestionDifficulty, QuestionSource } from 'types/models/question';
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
  submissions: SubmissionListItem[];
}

interface Row {
  id: number;
  question: QuestionBase;
  source: QuestionSource;
  submittedAt: Date;
  difficulty: QuestionDifficulty;
  languageUsed: Language;
}

const getColumns = (): TableColumn[] => {
  return [
    {
      label: 'Question',
      key: 'question',
      options: {
        customBodyRenderer: (question: QuestionBase): ReactNode => (
          <QuestionBox
            question={question}
            withBox={false}
            withDifficulty={false}
          />
        ),
        customSearchValueRenderer: (question: QuestionBase) => question.name,
        customCsvBodyRenderer: (question: QuestionBase) => question.name,
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
      label: 'Submitted At',
      key: 'submittedAt',
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
          <Link href={`${PAST_SUBMISSION}/${id}`} isExternal={true}>
            <Button variant="secondary">View</Button>
          </Link>
        ),
        isDownloadable: false,
        isSearchable: false,
      },
    },
  ];
};

const transformData = (submissions: SubmissionListItem[]): Row[] => {
  return submissions.map((submission) => ({
    id: submission.id,
    question: submission.question,
    submittedAt: submission.submittedAt,
    difficulty: submission.question.difficulty,
    source: submission.question.source,
    languageUsed: submission.languageUsed,
  }));
};

export const PastSubmissionsTable = ({
  submissions,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(), []);
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
