import { Fragment, ReactElement } from 'react';
import { Button } from '@chakra-ui/react';
import { Calendar, GetBackForwardPropsOptions } from 'dayzed';

interface Props {
  calendars: Calendar[];
  getForwardProps: (
    data: GetBackForwardPropsOptions,
  ) => Record<string, unknown>;
}

export const DatepickerForwardButtons = ({
  calendars,
  getForwardProps,
}: Props): ReactElement<Props, typeof Fragment> => {
  return (
    <>
      <Button {...getForwardProps({ calendars })} size="sm" variant="secondary">
        {'>'}
      </Button>
      <Button
        {...getForwardProps({
          calendars,
          offset: 12,
        })}
        size="sm"
        variant="secondary"
      >
        {'>>'}
      </Button>
    </>
  );
};
