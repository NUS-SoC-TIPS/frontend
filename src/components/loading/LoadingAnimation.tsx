import { ReactElement } from 'react';
import { Box } from '@chakra-ui/react';
import { useLottie } from 'lottie-react';

import animationData from 'assets/animations/loading.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

interface Props {
  width?: number;
}

/**
 * Height is in em.
 */
const LoadingAnimation = ({
  width = 10,
}: Props): ReactElement<Props, typeof Box> => {
  const { View } = useLottie(defaultOptions);

  return (
    <Box height="auto" width={`${width}em`}>
      {View}
    </Box>
  );
};

export default LoadingAnimation;
