import { PropsWithChildren, ReactElement } from 'react';

import { Dashboard, Page } from 'components/page';

interface Props {
  windows?: Window[];
  selectedIndex?: number;
  onChangeWindow?: (index: number) => void;
}

export const AdminPage = ({
  children,
}: PropsWithChildren<Props>): ReactElement<
  PropsWithChildren<Props>,
  typeof Page
> => {
  return (
    <Page>
      <Dashboard
        heading="Admin"
        subheading="See how students are doing over here!"
      >
        {children}
      </Dashboard>
    </Page>
  );
};
