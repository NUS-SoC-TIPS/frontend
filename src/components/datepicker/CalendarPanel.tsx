import React, { useCallback } from 'react';
import {
  Box,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { Props as DayzedHookProps, useDayzed } from 'dayzed';

import { ArrowKeysReact } from './ArrowKeysReact';
import { DatepickerBackButtons } from './DatepickerBackButtons';
import { DatepickerForwardButtons } from './DatepickerForwardButtons';
import { DayOfMonth } from './DayOfMonth';

interface CalendarPanelProps {
  dayzedHookProps: Omit<DayzedHookProps, 'children' | 'render'>;
  disabledDates?: Set<number>;
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  dayzedHookProps,
  disabledDates,
}) => {
  const renderProps = useDayzed(dayzedHookProps);
  const { calendars, getBackProps, getForwardProps } = renderProps;

  // looking for a useRef() approach to replace it
  const getKeyOffset = useCallback((num: number) => {
    const e = document.activeElement;
    const buttons = document.querySelectorAll('button');
    buttons.forEach((el, i) => {
      const newNodeKey = i + num;
      if (el === e) {
        if (newNodeKey <= buttons.length - 1 && newNodeKey >= 0) {
          buttons[newNodeKey].focus();
        } else {
          buttons[0].focus();
        }
      }
    });
  }, []);

  const arrowKeysReact = new ArrowKeysReact({
    left: (): void => {
      getKeyOffset(-1);
    },
    right: (): void => {
      getKeyOffset(1);
    },
    up: (): void => {
      getKeyOffset(-7);
    },
    down: (): void => {
      getKeyOffset(7);
    },
  });

  if (calendars.length <= 0) {
    return null;
  }

  return (
    <Stack
      className="datepicker-calendar"
      direction={['column', 'column', 'row']}
      {...arrowKeysReact.getEvents()}
    >
      {calendars.map((calendar, calendarIdx) => {
        return (
          <VStack
            borderWidth="1px"
            height="100%"
            key={calendarIdx}
            padding="0.5rem 0.75rem"
          >
            <HStack>
              <DatepickerBackButtons
                calendars={calendars}
                getBackProps={getBackProps}
              />
              <Heading px={3} size="2xs" textAlign="center">
                {dayjs().month(calendar.month).format('MMM')} {calendar.year}
              </Heading>
              <DatepickerForwardButtons
                calendars={calendars}
                getForwardProps={getForwardProps}
              />
            </HStack>
            <Divider />
            <SimpleGrid columns={7} spacing={1} textAlign="center">
              {[...Array(7).keys()].map((day, dayIdx) => (
                <Box fontSize="sm" fontWeight="semibold" key={dayIdx}>
                  {dayjs().day(day).format('ddd')}
                </Box>
              ))}
              {calendar.weeks.map((week, weekIdx) => {
                return week.map((dateObj, index) => {
                  const key = `${calendar.month}-${calendar.year}-${weekIdx}-${index}`;
                  if (!dateObj) {
                    return <Box key={key} />;
                  }
                  return (
                    <DayOfMonth
                      dateObj={dateObj}
                      disabledDates={disabledDates}
                      key={key}
                      renderProps={renderProps}
                    />
                  );
                });
              })}
            </SimpleGrid>
          </VStack>
        );
      })}
    </Stack>
  );
};
