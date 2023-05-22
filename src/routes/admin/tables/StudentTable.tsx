import { ReactElement } from 'react';

import { Card } from 'components/card';
import { WindowItem } from 'types/api/admin';
import { InterviewBase } from 'types/api/interviews';
import { SubmissionBase } from 'types/api/questions';
import { formatDateWithYear } from 'utils/dateUtils';

import { UserTable } from './UserTable';

interface Props {
  users: WindowItem['students'];
  window: {
    startAt: Date;
    endAt: Date;
    numQuestions: number;
    requireInterview: boolean;
  };
  onExclude: (id: number) => void;
  onViewSubmissions: (submissions: SubmissionBase[]) => void;
  onViewInterviews: (interviews: InterviewBase[]) => void;
}

export const StudentTable = ({
  users,
  window,
  onExclude,
  onViewSubmissions,
  onViewInterviews,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <UserTable
      isInclude={false}
      onIncludeOrExclude={onExclude}
      onViewInterviews={onViewInterviews}
      onViewSubmissions={onViewSubmissions}
      options={{
        title: 'Students',
        downloadFileName: `Students (${formatDateWithYear(
          window.startAt,
        )} - ${formatDateWithYear(window.endAt)})`,
      }}
      users={users}
      window={window}
    />
  );
};
