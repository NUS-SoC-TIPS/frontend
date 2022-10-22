import { memo, ReactElement } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Divider,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

import { StepCircle } from './StepCircle';

interface Props extends BoxProps {
  title: string;
  description: string;
  isActive: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  isDisabled: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  leftLineColor?: string;
  rightLineColor?: string;
}

const RawStep = (props: Props): ReactElement<Props, typeof Stack> => {
  const {
    isActive,
    isSuccess,
    isFailure,
    isDisabled,
    isFirstStep,
    isLastStep,
    leftLineColor,
    rightLineColor,
    title,
    description,
    ...boxProps
  } = props;
  const orientation = useBreakpointValue<'horizontal' | 'vertical'>(
    {
      base: 'vertical',
      md: 'horizontal',
    },
    { fallback: 'md' },
  );
  const buttonPadding = useBreakpointValue(
    { base: 2, lg: 4 },
    { fallback: 'lg' },
  );

  return (
    <Box height="100%" position="relative" width="100%" {...boxProps}>
      <Stack
        align="center"
        direction={{ base: 'row', md: 'column' }}
        flex={1}
        spacing={4}
      >
        <Button
          height="auto"
          isActive={isActive}
          justifyContent={{ base: 'start', md: 'center' }}
          marginY={{ base: 1, md: 0 }}
          padding={buttonPadding}
          variant="ghost"
          width={{ base: '100%', md: 'fit-content' }}
        >
          <Stack
            align="center"
            direction={{ base: 'row', md: 'column' }}
            spacing={4}
          >
            <Box boxSize={8} opacity={0} />
            <Stack align={{ base: 'start', md: 'center' }} spacing={1}>
              <Text color="emphasized" fontWeight="medium">
                {title}
              </Text>
              <Text color="muted">{description}</Text>
            </Stack>
          </Stack>
        </Button>
      </Stack>
      <Stack
        direction={{ base: 'row', md: 'column' }}
        height="100%"
        paddingX={{ base: 2, md: 0 }}
        paddingY={{ base: 0, md: buttonPadding }}
        pointerEvents="none"
        position="absolute"
        spacing={4}
        top={0}
        width="100%"
      >
        <Stack
          align="center"
          direction={{ base: 'column', md: 'row' }}
          spacing={0}
        >
          <Divider
            borderColor={
              isFirstStep ? 'transparent' : leftLineColor ?? 'inherit'
            }
            borderWidth="1px"
            orientation={orientation}
          />
          <StepCircle
            isDisabled={isDisabled}
            isFailure={isFailure}
            isSuccess={isSuccess}
          />
          <Divider
            borderColor={
              isLastStep ? 'transparent' : rightLineColor ?? 'inherit'
            }
            borderWidth="1px"
            orientation={orientation}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export const Step = memo(RawStep);
