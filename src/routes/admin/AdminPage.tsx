import { PropsWithChildren, ReactElement } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { Select } from 'components/select';
import { Window } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';
import { emptyFunction } from 'utils/functionUtils';

interface Props {
  windows?: Window[];
  onChangeWindow?: (window: Window) => void;
}

interface WindowOption {
  label: string;
  value: Window;
}

export const AdminPage = ({
  windows = [],
  onChangeWindow = emptyFunction,
  children,
}: PropsWithChildren<Props>): ReactElement<
  PropsWithChildren<Props>,
  typeof Page
> => {
  const selectWidth = useBreakpointValue({ base: '100%', lg: 'md' });
  const onChangeWrapper = (option: unknown): void => {
    if (!option) {
      return;
    }
    onChangeWindow((option as WindowOption).value);
  };
  const options = windows.map((w) => ({
    label: `${formatDate(w.startAt)} - ${formatDate(w.endAt)}`,
    value: w,
  }));

  return (
    <Page>
      <Dashboard
        actions={
          <Box w={selectWidth}>
            <Select
              defaultValue={options.length > 0 ? options[0] : undefined}
              isClearable={false}
              onChange={onChangeWrapper}
              options={options}
              placeholder="Select window..."
            />
          </Box>
        }
        heading="Admin"
        subheading="See how students are doing over here!"
      >
        {children}
      </Dashboard>
    </Page>
  );
};
