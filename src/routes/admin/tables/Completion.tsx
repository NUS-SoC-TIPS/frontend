import { ReactElement } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { HStack, Icon, StackProps, useColorModeValue } from '@chakra-ui/react';

interface Props {
  defaultValue?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rootProps?: StackProps;
}

export const Completion = ({
  defaultValue = 0,
  max = 5,
  size = 'md',
  rootProps,
}: Props): ReactElement<Props, typeof HStack> => {
  const color = useColorModeValue('gray.200', 'gray.600');
  const activeColor = useColorModeValue('blue.500', 'blue.200');

  return (
    <HStack spacing="0.5" {...rootProps}>
      {Array.from({ length: max })
        .map((_, index) => index + 1)
        .map((index) => (
          <Icon
            as={FaCheckCircle}
            color={index <= defaultValue ? activeColor : color}
            fontSize={size}
            key={index}
          />
        ))}
    </HStack>
  );
};
