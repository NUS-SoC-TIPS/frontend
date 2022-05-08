import { ReactElement } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Icon, IconProps } from '@chakra-ui/react';

interface Props extends IconProps {
  isOpen: boolean;
}

export const PopoverIcon = ({
  isOpen,
}: Props): ReactElement<Props, typeof Icon> => {
  const iconStyles = {
    transform: isOpen ? 'rotate(-180deg)' : undefined,
    transition: 'transform 0.2s',
    transformOrigin: 'center',
  };
  return <Icon __css={iconStyles} aria-hidden={true} as={FiChevronDown} />;
};
