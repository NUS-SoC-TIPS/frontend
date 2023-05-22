import { memo, ReactElement } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import { Circle, Icon, SquareProps } from '@chakra-ui/react';

interface Props extends SquareProps {
  icon: 'CHECK' | 'CROSS' | 'NONE';
  color: 'RED' | 'GREEN' | 'GREY' | 'NONE';
  isDisabled: boolean;
}

const RawStepCircle = (props: Props): ReactElement<Props, typeof Circle> => {
  const { icon, color, isDisabled, ...rest } = props;

  const getBgColor = (): string => {
    switch (color) {
      case 'RED':
        return 'red.300';
      case 'GREEN':
        return 'green.300';
      case 'GREY':
        return 'gray.500';
      case 'NONE':
        return 'inherit';
    }
  };

  const getIcon = (): ReactElement<typeof Icon | typeof Circle> => {
    switch (icon) {
      case 'CHECK':
        return <Icon as={HiCheck} boxSize={5} color="inverted" />;
      case 'CROSS':
        return <Icon as={HiX} boxSize={5} color="inverted" />;
      case 'NONE':
      default:
        return <Circle bg={isDisabled ? 'border' : 'accent'} size={3} />;
    }
  };

  return (
    <Circle
      bg={getBgColor()}
      borderColor={isDisabled ? 'inherit' : 'accent'}
      borderWidth={color === 'NONE' ? '2px' : 0}
      size={8}
      {...rest}
    >
      {getIcon()}
    </Circle>
  );
};

export const StepCircle = memo(RawStepCircle);
