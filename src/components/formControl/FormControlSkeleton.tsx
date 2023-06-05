import { PropsWithChildren, ReactElement } from 'react';
import { Input, Skeleton } from '@chakra-ui/react';

import { FormControl } from './FormControl';

interface Props {
  id: string;
  label: string;
}

export const FormControlSkeleton = ({
  id,
  label,
}: PropsWithChildren<Props>): ReactElement<
  PropsWithChildren<Props>,
  typeof FormControl
> => {
  return (
    <FormControl id={id} label={label}>
      <Skeleton>
        <Input />
      </Skeleton>
    </FormControl>
  );
};
