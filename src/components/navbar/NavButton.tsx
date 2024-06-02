import { ReactElement } from 'react';
import { As, Button, ButtonProps, HStack, Icon, Text } from '@chakra-ui/react';

interface Props extends ButtonProps {
  icon: As;
  label: string;
}

export const NavButton = (props: Props): ReactElement<Props, typeof Button> => {
  const { icon, label, ...buttonProps } = props;
  return (
    <Button
      border="none"
      justifyContent="start"
      variant="secondary"
      {...buttonProps}
    >
      <HStack spacing={3}>
        <Icon as={icon} boxSize={6} color="fg.subtle" />
        <Text>{label}</Text>
      </HStack>
    </Button>
  );
};
