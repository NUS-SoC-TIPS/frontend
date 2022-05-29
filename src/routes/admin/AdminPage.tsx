import { PropsWithChildren, ReactElement } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { Select } from 'components/select';
import { Window } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';
import { emptyFunction } from 'utils/functionUtils';

interface Props {
  windows?: Window[];
  selectedIndex?: number;
  onChangeWindow?: (index: number) => void;
}

interface WindowOption {
  label: string;
  value: number;
}

export const AdminPage = ({
  windows = [],
  selectedIndex = 0,
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
  const options: WindowOption[] = windows.map((w, index) => ({
    label: `${formatDate(w.startAt)} - ${formatDate(w.endAt)}`,
    value: index,
  }));

  return (
    <Page>
      <Dashboard
        actions={
          <Box w={selectWidth}>
            <Select
              defaultValue={
                options.length > 0 ? options[selectedIndex] : undefined
              }
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
