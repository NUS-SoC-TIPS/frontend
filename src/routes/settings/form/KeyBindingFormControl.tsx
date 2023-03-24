import { ReactElement, useCallback, useMemo } from 'react';

import { FormControl } from 'components/formControl';
import { Select } from 'components/select';
import { KEY_BINDING_TO_STRING } from 'constants/enumStrings';
import { KeyBinding } from 'types/models/code';

interface Props {
  onChangePreferredKeyBinding: (keyBinding: KeyBinding) => void;
  preferredKeyBinding: KeyBinding;
}

interface KeyBindingOption {
  label: string;
  value: KeyBinding;
}

export const KeyBindingFormControl = ({
  onChangePreferredKeyBinding,
  preferredKeyBinding,
}: Props): ReactElement<Props, typeof FormControl> => {
  const options: KeyBindingOption[] = useMemo(
    () =>
      [
        KeyBinding.STANDARD,
        KeyBinding.VIM,
        KeyBinding.EMACS,
        KeyBinding.SUBLIME,
      ].map((keyBinding) => ({
        label: KEY_BINDING_TO_STRING[keyBinding],
        value: keyBinding,
      })),
    [],
  );

  const onChangeWrapper = useCallback(
    (keyBinding: unknown): void => {
      onChangePreferredKeyBinding(
        keyBinding
          ? (keyBinding as KeyBindingOption).value
          : KeyBinding.STANDARD,
      );
    },
    [onChangePreferredKeyBinding],
  );

  return (
    <FormControl id="keyBinding" label="Preferred Key Binding">
      <Select
        defaultValue={{
          label: KEY_BINDING_TO_STRING[preferredKeyBinding],
          value: preferredKeyBinding,
        }}
        isClearable={false}
        onChange={onChangeWrapper}
        options={options}
        placeholder="Select preferred key binding..."
      />
    </FormControl>
  );
};
