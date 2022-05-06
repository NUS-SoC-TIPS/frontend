import { ReactElement } from 'react';
import { Box, chakra, IconButton, IconButtonProps } from '@chakra-ui/react';

const Bar = chakra('span', {
  baseStyle: {
    display: 'block',
    pos: 'absolute',
    w: '1.25rem',
    h: '0.125rem',
    rounded: 'full',
    bg: 'currentcolor',
    mx: 'auto',
    insetStart: '0.125rem',
    transition: 'all 0.12s',
  },
});

const ToggleIcon = (props: { active: boolean }): ReactElement<typeof Box> => {
  const { active } = props;
  return (
    <Box
      aria-hidden={true}
      as="span"
      className="group"
      data-active={active ? '' : undefined}
      display="block"
      h="1.5rem"
      pointerEvents="none"
      pos="relative"
      w="1.5rem"
    >
      <Bar
        _groupActive={{ top: '0.6875rem', transform: 'rotate(45deg)' }}
        top="0.4375rem"
      />
      <Bar
        _groupActive={{ bottom: '0.6875rem', transform: 'rotate(-45deg)' }}
        bottom="0.4375rem"
      />
    </Box>
  );
};

interface ToggleButtonProps extends IconButtonProps {
  isOpen: boolean;
}

export const ToggleButton = (
  props: ToggleButtonProps,
): ReactElement<typeof IconButton> => {
  const { isOpen, ...iconButtonProps } = props;
  return (
    <IconButton
      color={isOpen ? 'white' : 'muted'}
      icon={<ToggleIcon active={isOpen} />}
      position="relative"
      size="sm"
      variant="unstyled"
      zIndex="skipLink"
      {...iconButtonProps}
    />
  );
};
