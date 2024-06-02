import { PropsWithChildren, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { Dashboard, Page } from '@/components/page';
import { ADD_COHORT } from '@/constants/routes';

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
  const navigate = useNavigate();
  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={(): void => navigate(ADD_COHORT)} variant="primary">
            Add Cohort
          </Button>
        }
        heading="Admin"
        subheading="See how students are doing over here!"
      >
        {children}
      </Dashboard>
    </Page>
  );
};
