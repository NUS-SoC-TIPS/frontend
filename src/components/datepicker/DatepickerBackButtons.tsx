import { Fragment, ReactElement } from 'react';
import { Button } from '@chakra-ui/react';
import { Calendar, GetBackForwardPropsOptions } from 'dayzed';

interface Props {
  calendars: Calendar[];
  getBackProps: (data: GetBackForwardPropsOptions) => Record<string, unknown>;
}

export const DatepickerBackButtons = ({
  calendars,
  getBackProps,
}: Props): ReactElement<Props, typeof Fragment> => {
  return (
    <>
      <Button
        {...getBackProps({
          calendars,
          offset: 12,
        })}
        size="sm"
        variant="secondary"
      >
        {'<<'}
      </Button>
      <Button {...getBackProps({ calendars })} size="sm" variant="secondary">
        {'<'}
      </Button>
    </>
  );
};
