import { ReactElement, useState } from 'react';
import {
  FocusLock,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { DateObj } from 'dayzed';

import { formatDateWithYear } from 'utils/dateUtils';

import { CalendarPanel } from './CalendarPanel';

interface Props {
  id?: string;
  name?: string;
  date?: Date;
  onDateChange: (date: Date) => void;
}

export const Datepicker = ({
  id,
  name,
  date,
  onDateChange,
}: Props): ReactElement<Props> => {
  const [dateInView, setDateInView] = useState(date);
  const [offset, setOffset] = useState(0);

  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen: false });

  const onPopoverClose = (): void => {
    onClose();
    setDateInView(date);
    setOffset(0);
  };

  // dayzed utils
  const handleOnDateSelected = ({ selectable, date }: DateObj): void => {
    if (!selectable) {
      return;
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      onDateChange(date);
      onClose();
    }
  };

  return (
    <Popover
      isLazy={true}
      isOpen={isOpen}
      onClose={onPopoverClose}
      onOpen={onOpen}
      placement="bottom-start"
      variant="responsive"
    >
      <PopoverTrigger>
        <Input
          autoComplete="off"
          id={id}
          name={name}
          onChange={(e): string => e.target.value}
          onKeyPress={(e): void => {
            if (e.key === ' ' && !isOpen) {
              e.preventDefault();
              onOpen();
            }
          }}
          value={date != null ? formatDateWithYear(date) : ''}
        />
      </PopoverTrigger>
      <PopoverContent width="100%">
        <PopoverBody>
          <FocusLock>
            <CalendarPanel
              dayzedHookProps={{
                showOutsideDays: true,
                onDateSelected: handleOnDateSelected,
                selected: date,
                date: dateInView,
                offset: offset,
                onOffsetChanged: setOffset,
              }}
            />
          </FocusLock>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
