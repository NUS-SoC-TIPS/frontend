import { PropsWithChildren, ReactElement } from 'react';

import { Dashboard, Page } from 'components/page';

export const TasksPage = ({
  children,
}: PropsWithChildren<unknown>): ReactElement<
  PropsWithChildren<unknown>,
  typeof Page
> => {
  return (
    <Page>
      <Dashboard
        heading="Tasks"
        subheading="Select a cohort to see your progress for it!"
      >
        {children}
      </Dashboard>
    </Page>
  );
};
