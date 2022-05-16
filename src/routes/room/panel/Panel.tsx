import { ReactElement } from 'react';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from '@chakra-ui/react';
import autosize from 'autosize';
import { Socket } from 'socket.io-client';

import { useAppSelector } from 'app/hooks';
import { updateNotes } from 'lib/notesSocket';

interface Props {
  socket: Socket;
  height: number;
}

export const Panel = ({
  socket,
  height,
}: Props): ReactElement<Props, typeof Box> => {
  const { notes } = useAppSelector((state) => state.panel);

  return (
    <Box flex={1}>
      <Tabs>
        <TabList>
          <Tab>Notes</Tab>
          <Tab>Output</Tab>
        </TabList>
        <TabPanels height={`${height - 39}px`} overflow="scroll">
          <TabPanel>
            <Textarea
              borderColor="transparent"
              focusBorderColor="transparent"
              onChange={(event): void => {
                updateNotes(socket, event.target.value);
                autosize(document.querySelectorAll('textarea'));
              }}
              placeholder="Enter notes here for your partner. Your partner will only see these notes at the end of the session."
              pt={0}
              resize="none"
              rows={4}
              value={notes}
              variant="flushed"
            />
          </TabPanel>
          <TabPanel>WIP</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
