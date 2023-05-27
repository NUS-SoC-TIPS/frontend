import { ReactElement } from 'react';
import {
  Button,
  ButtonProps,
  Popover,
  PopoverContent,
  PopoverContentProps,
  PopoverTrigger,
} from '@chakra-ui/react';

import { PopoverIcon } from './PopoverIcon';

interface Props {
  trigger: ReactElement | string;
  content: ReactElement;
  isDisabled?: boolean;
  buttonProps?: ButtonProps;
  popoverContentProps?: PopoverContentProps;
}

export const MyPopover = ({
  trigger,
  content,
  isDisabled = false,
  buttonProps = {},
  popoverContentProps = {},
}: Props): ReactElement<Props, typeof Popover> | null => {
  return (
    <Popover
      gutter={12}
      isOpen={isDisabled ? false : undefined}
      openDelay={0}
      placement="bottom"
      trigger="hover"
    >
      {({ isOpen }): ReactElement => (
        <>
          <PopoverTrigger>
            <Button
              isDisabled={isDisabled}
              rightIcon={<PopoverIcon isOpen={isOpen} />}
              {...buttonProps}
            >
              {trigger}
            </Button>
          </PopoverTrigger>
          <PopoverContent {...popoverContentProps}>{content}</PopoverContent>
        </>
      )}
    </Popover>
  );
};
