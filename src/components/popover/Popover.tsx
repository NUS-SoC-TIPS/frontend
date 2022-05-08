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
  buttonProps?: ButtonProps;
  popoverContentProps?: PopoverContentProps;
}

export const MyPopover = ({
  trigger,
  content,
  buttonProps = {},
  popoverContentProps = {},
}: Props): ReactElement<Props, typeof Popover> | null => {
  return (
    <Popover gutter={12} openDelay={0} placement="bottom" trigger="hover">
      {({ isOpen }): ReactElement => (
        <>
          {/* @ts-expect-error: Prop types mismatch for children in React 18 */}
          <PopoverTrigger>
            <Button
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
