import { ReactElement } from 'react';

import { Card } from '@/components/card';
import { WindowItem } from '@/types/api/admin';
import { ExcuseBase } from '@/types/api/excuses';
import { InterviewBase } from '@/types/api/interviews';
import { SubmissionBase } from '@/types/api/questions';
import { StudentBase } from '@/types/api/students';
import { formatDateWithYear } from '@/utils/dateUtils';

import { UserTable } from './UserTable';

interface Props {
  users: WindowItem['students'];
  window: { startAt: Date; endAt: Date; requireInterview: boolean };
  onExclude: (id: number) => void;
  onAutoExclude: () => void;
  onPairStudents: () => void;
  onViewSubmissions: (submissions: SubmissionBase[]) => void;
  onViewInterviews: (interviews: InterviewBase[]) => void;
  onViewPartner: (partner: StudentBase) => void;
  excuses?: ExcuseBase[] | null;
}

export const StudentTable = ({
  users,
  window,
  onExclude,
  onAutoExclude,
  onPairStudents,
  onViewSubmissions,
  onViewInterviews,
  onViewPartner,
  excuses,
}: Props): ReactElement<Props, typeof Card> => {
  let extraActionName: string | undefined = undefined;
  let onExtraAction: (() => void) | undefined = undefined;
  const now = new Date();
  if (window.endAt <= now) {
    // Window has ended, we can auto-exclude now.
    extraActionName = 'Auto Exclude';
    onExtraAction = onAutoExclude;
  } else if (window.startAt <= now && window.requireInterview) {
    // Window is ongoing, we can pair now.
    extraActionName = 'Pair Students';
    onExtraAction = onPairStudents;
  }

  return (
    <UserTable
      excuses={excuses}
      extraActionName={extraActionName}
      isInclude={false}
      onExtraAction={onExtraAction}
      onIncludeOrExclude={onExclude}
      onViewInterviews={onViewInterviews}
      onViewPartner={onViewPartner}
      onViewSubmissions={onViewSubmissions}
      options={{
        title: 'Students',
        downloadFileName: `Students (${formatDateWithYear(
          window.startAt,
        )} - ${formatDateWithYear(window.endAt)})`,
      }}
      users={users}
    />
  );
};
