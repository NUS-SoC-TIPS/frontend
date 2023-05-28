import { ReactElement } from 'react';
import { Button } from '@chakra-ui/react';
import { DateObj, RenderProps } from 'dayzed';

interface Props {
  renderProps: RenderProps;
  disabledDates?: Set<number>;
  dateObj: DateObj;
}

const halfGap = 0.125; // Default Chakra-gap-space-1 is 0.25rem

export const DayOfMonth = ({
  dateObj,
  disabledDates,
  renderProps,
}: Props): ReactElement<Props, typeof Button> => {
  const { date, selected, selectable, today } = dateObj;
  const { getDateProps } = renderProps;
  const disabled = !selectable || disabledDates?.has(date.getTime());
  const styleBtnProps = {
    defaultBtnProps: {
      size: 'sm',
      variant: 'ghost',
      // this intends to fill the visual gap from Grid to improve the UX
      // so the button active area is actually larger than what it's seen
      _after: {
        content: "''",
        position: 'absolute',
        top: `-${halfGap}rem`,
        left: `-${halfGap}rem`,
        bottom: `-${halfGap}rem`,
        right: `-${halfGap}rem`,
        borderWidth: `${halfGap}rem`,
        borderColor: 'transparent',
      },
      _hover: {
        bg: 'gray.500',
        _disabled: {
          bg: 'gray.100',
        },
      },
    },
    isInRangeBtnProps: { background: 'gray.600' },
    selectedBtnProps: { background: 'gray.600' },
    todayBtnProps: { borderColor: 'blue.400' },
  };

  return (
    <Button
      {...getDateProps({ dateObj, disabled: disabled })}
      isDisabled={disabled}
      {...styleBtnProps.defaultBtnProps}
      {...(selected && !disabled && styleBtnProps.selectedBtnProps)}
      {...(today && styleBtnProps.todayBtnProps)}
    >
      {date.getDate()}
    </Button>
  );
};
