import { PropsWithChildren, ReactElement } from 'react';
import { FiExternalLink, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Button, Link, Stack } from '@chakra-ui/react';

import { Dashboard, Page } from '@/components/page';
import { TASKS } from '@/constants/routes';

interface Props {
  coursemologyUrl?: string;
  email?: string;
}

export const TasksBreakdownPage = ({
  coursemologyUrl,
  email,
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
          <Stack direction="row" spacing={2}>
            {coursemologyUrl ? (
              <Link href={coursemologyUrl} isExternal={true}>
                <Button
                  leftIcon={<FiExternalLink fontSize="1.25rem" />}
                  variant="secondary"
                >
                  Coursemology
                </Button>
              </Link>
            ) : (
              <Button
                isDisabled={true}
                leftIcon={<FiExternalLink fontSize="1.25rem" />}
                variant="secondary"
              >
                Coursemology
              </Button>
            )}
            {email ? (
              <Link href={`mailto:${email}`}>
                <Button
                  leftIcon={<FiMail fontSize="1.25rem" />}
                  variant="secondary"
                >
                  Email Us
                </Button>
              </Link>
            ) : (
              <Button
                isDisabled={true}
                leftIcon={<FiMail fontSize="1.25rem" />}
                variant="secondary"
              >
                Email Us
              </Button>
            )}
            <Button onClick={(): void => navigate(TASKS)} variant="secondary">
              Back to Cohorts
            </Button>
          </Stack>
        }
        heading="Tasks"
        subheading="Track your progress for this cohort here!"
      >
        {children}
      </Dashboard>
    </Page>
  );
};
