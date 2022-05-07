import { ReactElement } from 'react';
import { As, Button, ButtonProps, HStack, Icon, Text } from '@chakra-ui/react';

interface Props extends ButtonProps {
  icon: As;
  label: string;
}

export const NavButton = (props: Props): ReactElement<Props, typeof Button> => {
  const { icon, label, ...buttonProps } = props;
  return (
    <Button justifyContent="start" variant="ghost" {...buttonProps}>
      <HStack spacing="3">
        <Icon as={icon} boxSize="6" color="subtle" />
        <Text>{label}</Text>
      </HStack>
    </Button>
  );
};
