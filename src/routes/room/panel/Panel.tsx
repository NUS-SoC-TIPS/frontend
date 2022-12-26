import {
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Badge,
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

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { updateNotes } from 'lib/notesSocket';
import { viewOutput } from 'reducers/panelReducer';

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

const MIN_WIDTH_FOR_BADGE = 250;

interface Props {
  socket: Socket;
  height: number;
  width: number;
}

export const Panel = ({
  socket,
  height,
  width,
}: Props): ReactElement<Props, typeof Box> => {
  const [tabIndex, setTabIndex] = useState(0);
  const {
    notes,
    executionOutput,
    statusDescription,
    isErrorOutput,
    hasUnviewedOutput,
  } = useAppSelector((state) => state.panel);
  const ref = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (hasUnviewedOutput && tabIndex === 1) {
      dispatch(viewOutput());
    }
  }, [hasUnviewedOutput, tabIndex, dispatch]);

  useEffect(() => {
    const textarea = ref.current;
    if (textarea) {
      autosize(textarea);
    }
    return () => {
      if (textarea) {
        autosize.destroy(textarea);
      }
    };
  }, []);

  const handleTabsChange = (index: number): void => {
    setTabIndex(index);
  };

  const lines = executionOutput != null ? executionOutput.split('\n') : [];

  return (
    <Box flex={1}>
      <Tabs index={tabIndex} onChange={handleTabsChange}>
        <TabList position="relative">
          <CustomTab>Notes</CustomTab>
          <CustomTab showCircle={hasUnviewedOutput}>Output</CustomTab>
          {statusDescription != null && width >= MIN_WIDTH_FOR_BADGE && (
            <Badge
              colorScheme={isErrorOutput ? 'red' : 'green'}
              fontSize="xs"
              position="absolute"
              right={2}
              top="50%"
              transform="auto"
              translateY="-50%"
            >
              {statusDescription}
            </Badge>
          )}
        </TabList>
        <TabPanels
          cursor={tabIndex === 0 ? 'text' : undefined}
          height={`${height - 39}px`}
          onClick={(): void => ref.current?.focus()}
          overflow="scroll"
        >
          <TabPanel>
            <Textarea
              borderColor="transparent"
              focusBorderColor="transparent"
              onChange={(event): void =>
                updateNotes(socket, event.target.value)
              }
              placeholder="Enter notes here for your partner. Your partner will only see these notes at the end of the session."
              pt={0}
              ref={ref}
              resize="none"
              rows={4}
              size="sm"
              value={notes}
              variant="flushed"
            />
          </TabPanel>
          <TabPanel>
            {statusDescription != null && width < MIN_WIDTH_FOR_BADGE && (
              <Badge
                colorScheme={isErrorOutput ? 'red' : 'green'}
                fontSize="xs"
                mb={2}
              >
                {statusDescription}
              </Badge>
            )}
            {executionOutput == null ? (
              <Code fontSize="sm">Execute the code to see its output!</Code>
            ) : lines.length === 1 && lines[0] === '' ? (
              <Code fontSize="sm" width="100%">
                No output
              </Code>
            ) : (
              <Code
                colorScheme={isErrorOutput ? 'red' : 'green'}
                fontSize="sm"
                whiteSpace="pre-wrap"
                width="100%"
                wordBreak="break-all"
              >
                {lines.map((line, index) => {
                  if (line === '' && index === lines.length - 1) {
                    // If it's the last line of many lines and it's empty, we don't want to render it
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
