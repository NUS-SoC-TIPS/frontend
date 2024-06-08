import React from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { HStack, Tag, Text, Tooltip } from '@chakra-ui/react';

export const ExcuseTag = (): React.FC => {
  return (
    <Tag>
      <HStack spacing={1}>
        <Tooltip hasArrow={true} label="Excuse Under Review" placement="top">
          <span>
            <HiOutlineInformationCircle />
          </span>
        </Tooltip>
        <Text>Pending Excuse</Text>
      </HStack>
    </Tag>
  );
};
