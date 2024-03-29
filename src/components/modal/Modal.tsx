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
  textAlignCentre?: boolean;
  showActions?: boolean;
  showCloseIcon?: boolean;
}

const DEFAULT_PROPS: Partial<ModalProps> = {
  isCentered: true,
};

export const Modal = (props: Props): ReactElement<typeof ChakraModal> => {
  const {
    title,
    actions,
    children,
    showCloseIcon = false,
    textAlignCentre = false,
    showActions = true,
    ...modalProps
  } = props;
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
        <ModalBody p={{ base: 4, lg: 6 }}>
          <ModalHeader p={2} textAlign={textAlignCentre ? 'center' : undefined}>
            {title}
          </ModalHeader>
          {showCloseIcon ?? <ModalCloseButton />}
          <ModalBody p={2} textAlign={textAlignCentre ? 'center' : undefined}>
            {children}
          </ModalBody>
          {showActions && (
            <ModalFooter p={2}>
              {actions ? (
                actions
              ) : (
                <Button colorScheme="blue" onClick={props.onClose}>
                  Close
                </Button>
              )}
            </ModalFooter>
          )}
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};
