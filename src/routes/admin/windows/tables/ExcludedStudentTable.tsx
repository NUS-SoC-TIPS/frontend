import { ReactElement } from 'react';

import { Card } from 'components/card';
import { WindowItem } from 'types/api/admin';
import { InterviewBase } from 'types/api/interviews';
import { SubmissionBase } from 'types/api/questions';
import { StudentBase } from 'types/api/students';
import { formatDateWithYear } from 'utils/dateUtils';

import { UserTable } from './UserTable';

interface Props {
  users: WindowItem['students'];
  window: { startAt: Date; endAt: Date };
  onInclude: (id: number) => void;
  onViewSubmissions: (submissions: SubmissionBase[]) => void;
  onViewInterviews: (interviews: InterviewBase[]) => void;
  onViewPartner: (partner: StudentBase) => void;
}

export const ExcludedStudentTable = ({
  users,
  window,
  onInclude,
  onViewSubmissions,
  onViewInterviews,
  onViewPartner,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <UserTable
      isInclude={true}
      onIncludeOrExclude={onInclude}
      onViewInterviews={onViewInterviews}
      onViewPartner={onViewPartner}
      onViewSubmissions={onViewSubmissions}
      options={{
        title: 'Excluded',
        downloadFileName: `Excluded Students (${formatDateWithYear(
          window.startAt,
        )} - ${formatDateWithYear(window.endAt)})`,
      }}
      users={users}
    />
  );
};
