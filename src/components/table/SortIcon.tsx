import { ReactElement } from 'react';
import { FiArrowDown } from 'react-icons/fi';
import { Icon, IconProps } from '@chakra-ui/react';

interface Props extends IconProps {
  isAscending: boolean;
}

export const SortIcon = ({
  isAscending,
}: Props): ReactElement<Props, typeof Icon> => {
  const iconStyles = {
    transform: isAscending ? 'rotate(-180deg)' : undefined,
    transition: 'transform 0.2s',
    transformOrigin: 'center',
  };
  return (
    <Icon
      __css={iconStyles}
      aria-hidden={true}
      as={FiArrowDown}
      ml={2}
      size="sm"
    />
  );
};
