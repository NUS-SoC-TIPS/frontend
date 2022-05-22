import { ReactElement } from 'react';
import {
  BoxProps,
  Divider,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

import { StepCircle } from './StepCircle';

interface Props extends BoxProps {
  title: string;
  description: string;
  isSuccess: boolean;
  isFailure: boolean;
  isActive: boolean; // May not necessarily be success nor failure, just active
  isFirstStep: boolean;
  isLastStep: boolean;
  leftLineColor?: string;
  rightLineColor?: string;
}

export const Step = (props: Props): ReactElement<Props, typeof Stack> => {
  const {
    isSuccess,
    isFailure,
    isActive,
    isFirstStep,
    isLastStep,
    leftLineColor,
    rightLineColor,
    title,
    description,
    ...stackProps
  } = props;
  const isMobile = useBreakpointValue({ base: true, md: false });

  const orientation = useBreakpointValue<'horizontal' | 'vertical'>({
    base: 'vertical',
    md: 'horizontal',
  });

  return (
    <Stack
      direction={{ base: 'row', md: 'column' }}
      flex="1"
      spacing="4"
      {...stackProps}
    >
      <Stack
        align="center"
        direction={{ base: 'column', md: 'row' }}
        spacing="0"
      >
        <Divider
          borderColor={isFirstStep ? 'transparent' : leftLineColor ?? 'inherit'}
          borderWidth="1px"
          orientation={orientation}
        />
        <StepCircle
          isActive={isActive}
          isFailure={isFailure}
          isSuccess={isSuccess}
        />
        <Divider
          borderColor={isLastStep ? 'transparent' : rightLineColor ?? 'inherit'}
          borderWidth="1px"
          orientation={orientation}
        />
      </Stack>
      <Stack
        align={{ base: 'start', md: 'center' }}
        pb={isMobile ? '4' : '0'}
        pt={isMobile ? '4' : '0'}
        spacing="0.5"
      >
        <Text color="emphasized" fontWeight="medium">
          {title}
        </Text>
        <Text color="muted">{description}</Text>
      </Stack>
    </Stack>
  );
};
