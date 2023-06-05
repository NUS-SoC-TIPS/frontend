import { PropsWithChildren, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { VIEW_COHORT } from 'constants/routes';

interface Props {
  heading?: string;
  cohortId?: number;
}

export const ViewWindowPage = ({
  heading = 'Viewing Window',
  cohortId,
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
          <Button
            isDisabled={cohortId == null}
            onClick={
              cohortId != null
                ? (): void => navigate(`${VIEW_COHORT}/${cohortId}`)
                : undefined
            }
            variant="secondary"
          >
            Back to Cohort
          </Button>
        }
        heading={heading}
        subheading="See how students are doing for this window here!"
      >
        {children}
      </Dashboard>
    </Page>
  );
};
