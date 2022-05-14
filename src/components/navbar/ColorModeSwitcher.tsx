import { ReactElement } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import {
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';

import { NavButton } from './NavButton';

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'> & {
  isSideBar: boolean;
};

export const ColorModeSwitcher = (
  props: ColorModeSwitcherProps,
): ReactElement<ColorModeSwitcherProps, typeof IconButton> => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FiMoon, FiSun);
  const { isSideBar, ...buttonProps } = props;

  if (isSideBar) {
    return (
      <NavButton
        icon={SwitchIcon}
        label={`Switch to ${text} mode`}
        onClick={toggleColorMode}
      />
    );
  }

  return (
    <IconButton
      aria-label={`Switch to ${text} mode`}
      color="current"
      fontSize="lg"
      icon={<SwitchIcon />}
      marginLeft="2"
      onClick={toggleColorMode}
      size="md"
      variant="ghost"
      {...buttonProps}
    />
  );
};
