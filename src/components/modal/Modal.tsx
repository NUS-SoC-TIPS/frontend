import React, { forwardRef, ReactElement, ReactNode } from 'react';
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

export const Modal = forwardRef(function Modal(
  props: Props,
  ref?: React.Ref<HTMLDivElement>,
): ReactElement<typeof ChakraModal> {
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
      <ModalContent bg="bg.canvas" borderRadius="2xl" ref={ref}>
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
                <Button onClick={props.onClose}>Close</Button>
              )}
            </ModalFooter>
          )}
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
});
