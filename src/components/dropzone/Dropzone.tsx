import { ReactElement } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import {
  Button,
  Center,
  CenterProps,
  HStack,
  Icon,
  Square,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

export const Dropzone = (
  props: CenterProps,
): ReactElement<CenterProps, typeof Center> => (
  <Center
    bg={useColorModeValue('white', 'gray.800')}
    borderRadius="lg"
    borderWidth="1px"
    px="6"
    py="4"
    {...props}
  >
    <VStack spacing="3">
      <Square bg="bg-subtle" borderRadius="lg" size="10">
        <Icon as={FiUploadCloud} boxSize="5" color="muted" />
      </Square>
      <VStack spacing="1">
        <HStack spacing="1" whiteSpace="nowrap">
          <Button colorScheme="blue" size="sm" variant="link">
            Click to upload
          </Button>
          <Text color="muted" fontSize="sm">
            or drag and drop
          </Text>
        </HStack>
        <Text color="muted" fontSize="xs">
          PNG, JPG or GIF up to 1MB
        </Text>
      </VStack>
    </VStack>
  </Center>
);
