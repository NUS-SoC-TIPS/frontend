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
      <Dashboard heading="Tasks" subheading="Track your progress here!">
        {children}
      </Dashboard>
    </Page>
  );
};
