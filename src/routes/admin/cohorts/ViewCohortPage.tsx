import { PropsWithChildren, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, HStack } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { ADMIN } from 'constants/routes';

interface Props {
  onRematchWindows?: () => void;
  isRematchingWindows?: boolean;
}

export const ViewCohortPage = ({
  onRematchWindows,
  isRematchingWindows = false,
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
          <HStack spacing={2}>
            <Button
              isDisabled={onRematchWindows == null}
              isLoading={isRematchingWindows}
              onClick={onRematchWindows}
              variant="secondary"
            >
              Rematch Windows
            </Button>
            <Button onClick={(): void => navigate(ADMIN)} variant="secondary">
              Back to Admin
            </Button>
          </HStack>
        }
        heading="Viewing Cohort"
        subheading="View and update the basic information, windows and students of a cohort here."
      >
        {children}
      </Dashboard>
    </Page>
  );
};
