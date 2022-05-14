import { ReactElement, ReactNode } from 'react';
import {
  Button,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';

interface Props extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actions?: ReactNode;
}

const DEFAULT_PROPS: Partial<ModalProps> = {
  isCentered: true,
};

export const Modal = (props: Props): ReactElement<typeof ChakraModal> => {
  const { title, actions, children, ...modalProps } = props;
  const combinedProps = {
    ...DEFAULT_PROPS,
    ...modalProps,
  };

  return (
    <ChakraModal {...combinedProps}>
      <ModalOverlay
        backdropFilter="blur(10px) hue-rotate(90deg)"
        bg="blackAlpha.300"
      />
      <ModalContent borderRadius="2xl">
        <ModalBody>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            {actions ? (
              actions
            ) : (
              <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                Close
              </Button>
            )}
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};
