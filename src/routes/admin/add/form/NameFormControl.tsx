import { ReactElement } from 'react';

import { FormControl, TextFormControl } from 'components/formControl';

interface Props {
  name: string;
  onChange: (name: string) => void;
}

export const NameFormControl = ({
  name,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <TextFormControl id="name" label="Name" onChange={onChange} value={name} />
  );
};
