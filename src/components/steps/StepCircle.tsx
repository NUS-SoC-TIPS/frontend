import { ReactElement } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import { Circle, Icon, SquareProps } from '@chakra-ui/react';

interface Props extends SquareProps {
  isSuccess: boolean;
  isFailure: boolean;
  isActive: boolean;
}

export const StepCircle = (
  props: Props,
): ReactElement<Props, typeof Circle> => {
  const { isSuccess, isActive, isFailure } = props;
  return (
    <Circle
      bg={isSuccess ? 'accent' : isFailure ? 'error' : 'inherit'}
      borderColor={isActive ? 'accent' : 'inherit'}
      borderWidth={isSuccess || isFailure ? 0 : '2px'}
      size={8}
      {...props}
    >
      {isSuccess ? (
        <Icon as={HiCheck} boxSize={5} color="inverted" />
      ) : isFailure ? (
        <Icon as={HiX} boxSize={5} color="on-accent" />
      ) : (
        <Circle bg={isActive ? 'accent' : 'border'} size={3} />
      )}
    </Circle>
  );
};
