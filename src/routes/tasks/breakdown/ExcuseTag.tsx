import { ReactElement } from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { HStack, Tag, Text, Tooltip } from '@chakra-ui/react';

import { ExcuseStatus } from '@/types/models/excuse';

interface Props {
  status: ExcuseStatus;
}

const excuseStatusMap = {
  [ExcuseStatus.PENDING]: {
    color: 'gray',
    label: 'Pending Excuse',
    helperText: 'Excuse Under Review',
  },
  [ExcuseStatus.ACCEPTED]: {
    color: 'green',
    label: 'Approved Excuse',
    helperText: 'Excuse Approved',
  },
  [ExcuseStatus.REJECTED]: {
    color: 'red',
    label: 'Rejected Excuse',
    helperText: 'Please Email SOC Tips for More Information',
  },
};

export const ExcuseTag = ({ status }: Props): ReactElement<typeof Tag> => {
  return (
    <Tag colorScheme={excuseStatusMap[status]?.color}>
      <HStack spacing={1}>
        <Tooltip
          hasArrow={true}
          label={excuseStatusMap[status]?.helperText}
          placement="top"
        >
          <span>
            <HiOutlineInformationCircle />
          </span>
        </Tooltip>
        <Text>{excuseStatusMap[status]?.label}</Text>
      </HStack>
    </Tag>
  );
};
