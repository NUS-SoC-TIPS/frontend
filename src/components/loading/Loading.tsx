import { memo, ReactElement, useEffect, useState } from 'react';
import { Box, SlideFade } from '@chakra-ui/react';

import { LoadingAnimation } from './LoadingAnimation';

const RawLoading = (): ReactElement<'div'> => {
  const [isShown, setIsShown] = useState(false);
  useEffect(() => {
    setIsShown(true);
  }, []);
  return (
    <Box
      alignItems="center"
      display="flex"
      height="100vh"
      justifyContent="center"
      width="100vw"
    >
      <SlideFade in={isShown} offsetY="20px">
        <LoadingAnimation />
      </SlideFade>
    </Box>
  );
};

export const Loading = memo(RawLoading);
