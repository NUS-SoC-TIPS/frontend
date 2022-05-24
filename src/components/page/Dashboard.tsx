import { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react';

interface Props {
  heading: string;
  subheading: string;
  actions?: ReactNode;
}

export const Dashboard = ({
  heading,
  subheading,
  actions = null,
  children,
}: PropsWithChildren<Props>): ReactElement<
  PropsWithChildren<Props>,
  typeof Stack
> => {
  const size = useBreakpointValue({ base: 'xs', lg: 'sm' });
  return (
    <Stack spacing={{ base: '8', lg: '6' }}>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        justify="space-between"
        spacing="4"
      >
        <Stack spacing="1">
          <Heading fontWeight="medium" size={size}>
            {heading}
          </Heading>
          <Text color="muted">{subheading}</Text>
        </Stack>
        {actions}
      </Stack>
      <Stack spacing={{ base: '5', lg: '6' }}>{children}</Stack>
    </Stack>
  );
};
