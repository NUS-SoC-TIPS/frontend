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
  isDisabled: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  icon: 'CHECK' | 'CROSS' | 'NONE';
  color: 'RED' | 'GREEN' | 'GREY' | 'NONE';
  leftLineColor: 'RED' | 'GREEN' | 'GREY' | 'NONE';
  rightLineColor: 'RED' | 'GREEN' | 'GREY' | 'NONE';
}

const RawStep = (props: Props): ReactElement<Props, typeof Stack> => {
  const {
    isActive,
    isDisabled,
    isFirstStep,
    isLastStep,
    icon,
    color,
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
    { ssr: false },
  );
  const buttonPadding = useBreakpointValue({ base: 2, lg: 4 }, { ssr: false });

  const getColor = (
    color: 'RED' | 'GREEN' | 'GREY' | 'NONE',
  ): string | undefined => {
    switch (color) {
      case 'RED':
        return 'red.300';
      case 'GREEN':
        return 'green.200';
      case 'GREY':
        return 'gray.500';
      case 'NONE':
        return undefined;
    }
  };

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
            borderColor={isFirstStep ? 'transparent' : getColor(leftLineColor)}
            borderWidth="1px"
            orientation={orientation}
          />
          <StepCircle color={color} icon={icon} isDisabled={isDisabled} />
          <Divider
            borderColor={isLastStep ? 'transparent' : getColor(rightLineColor)}
            borderWidth="1px"
            orientation={orientation}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export const Step = memo(RawStep);
