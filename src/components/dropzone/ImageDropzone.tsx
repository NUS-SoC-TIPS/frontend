import { memo, ReactElement, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import {
  Button,
  Center,
  CenterProps,
  HStack,
  Icon,
  Spinner,
  Square,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

import { uploadImageToCloudinary } from 'lib/cloudinary';

interface Props extends Omit<CenterProps, 'onChange'> {
  onChange: (url: string) => void;
}

const RawImageDropzone = ({
  onChange,
  ...props
}: Props): ReactElement<Props, typeof Center> => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1 || acceptedFiles.length === 0) {
        return;
      }
      acceptedFiles.forEach((file: File) => {
        setIsUploading(true);
        uploadImageToCloudinary(file)
          .then((url) => {
            onChange(url);
          })
          .finally(() => {
            // TODO: Add some error handling here
            setIsUploading(false);
          });
      });
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
    },
    multiple: false,
    disabled: isUploading,
  });

  return (
    <Center
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="lg"
      borderWidth="1px"
      px={6}
      py={4}
      {...props}
    >
      <VStack spacing={3} w="100%" {...getRootProps()}>
        <input {...getInputProps()} />
        <Square bg="bg-subtle" borderRadius="lg" size={10}>
          {isUploading ? (
            <Spinner />
          ) : (
            <Icon as={FiUploadCloud} boxSize={5} color="muted" />
          )}
        </Square>
        {isDragActive ? (
          <VStack spacing={1}>
            <HStack spacing={1} whiteSpace="nowrap">
              <Text color="muted" fontSize="sm">
                Release to upload file
              </Text>
            </HStack>
            <Text color="muted" fontSize="xs">
              PNG, JPG or GIF up to 1MB
            </Text>
          </VStack>
        ) : (
          <VStack spacing={1}>
            <HStack spacing={1} whiteSpace="nowrap">
              {isUploading ? (
                <Text color="muted" fontSize="sm">
                  Uploading...
                </Text>
              ) : (
                <>
                  <Button colorScheme="blue" size="sm" variant="link">
                    Click to upload
                  </Button>
                  <Text color="muted" fontSize="sm">
                    or drag and drop
                  </Text>
                </>
              )}
            </HStack>
            <Text color="muted" fontSize="xs">
              PNG, JPG or GIF up to 1MB
            </Text>
          </VStack>
        )}
      </VStack>
    </Center>
  );
};

export const ImageDropzone = memo(RawImageDropzone);
