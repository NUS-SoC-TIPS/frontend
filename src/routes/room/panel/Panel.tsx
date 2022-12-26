import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Circle,
  Code,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useMultiStyleConfig,
  useTab,
  UseTabProps,
} from '@chakra-ui/react';
import autosize from 'autosize';
import { Socket } from 'socket.io-client';

import { useAppSelector } from 'app/hooks';
import { updateNotes } from 'lib/notesSocket';

const CustomTab = forwardRef(
  <P extends UseTabProps & { showCircle?: boolean }>(
    props: P,
    ref: Ref<HTMLElement>,
  ) => {
    const { showCircle, ...useTabProps } = props;
    const tabProps = useTab({ ...useTabProps, ref });
    const styles = useMultiStyleConfig('Tabs', tabProps);

    return (
      <Button
        __css={{ ...styles.tab, display: 'flex', alignItems: 'center' }}
        {...tabProps}
      >
        {tabProps.children}
        {!!showCircle && <Circle bg="accent" ml={2} size={2} />}
      </Button>
    );
  },
);

CustomTab.displayName = 'CustomTab';

interface Props {
  socket: Socket;
  height: number;
}

export const Panel = ({
  socket,
  height,
}: Props): ReactElement<Props, typeof Box> => {
  const [tabIndex, setTabIndex] = useState(0);
  const [hasUnviewedOutput, setHasUnviewedOutput] = useState(false);
  const { notes, executionOutput, isErrorOutput } = useAppSelector(
    (state) => state.panel,
  );

  useEffect(() => {
    if (executionOutput != null && tabIndex !== 1) {
      setHasUnviewedOutput(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executionOutput]);

  const handleTabsChange = (index: number): void => {
    setTabIndex(index);
    if (index === 1) {
      setHasUnviewedOutput(false);
    }
  };

  const lines = executionOutput != null ? executionOutput.split('\n') : [];

  return (
    <Box flex={1}>
      <Tabs index={tabIndex} onChange={handleTabsChange}>
        <TabList>
          <CustomTab>Notes</CustomTab>
          <CustomTab showCircle={hasUnviewedOutput}>Output</CustomTab>
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
          <TabPanel>
            {executionOutput == null ? (
              <Code>Execute the code to see its output!</Code>
            ) : (
              <Code
                colorScheme={isErrorOutput ? 'red' : undefined}
                height="100%"
                whiteSpace="pre-wrap"
                width="100%"
                wordBreak="break-all"
              >
                {lines.map((line, index) => {
                  if (line === '' && index === lines.length - 1) {
                    // If it's the last line and it's empty, we don't want to render it
                    return <></>;
                  }
                  if (line === '') {
                    return <p key={index}>&nbsp;</p>;
                  }
                  return <p key={index}>{line}</p>;
                })}
              </Code>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
