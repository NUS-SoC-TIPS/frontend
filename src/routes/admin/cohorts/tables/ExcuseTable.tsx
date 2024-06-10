import { ReactElement, ReactNode, useCallback, useMemo, useState } from 'react';
import { HiFilter } from 'react-icons/hi';
import {
  Button,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Stack,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react';

import { Card } from '@/components/card';
import { Modal } from '@/components/modal';
import { Table } from '@/components/table';
import { UserProfile } from '@/components/userProfile';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from '@/constants/toast';
import { approveExcuse, rejectExcuse } from '@/lib/excuses';
import { ExcuseBase } from '@/types/api/excuses';
import { UserBase } from '@/types/api/users';
import { WindowBase } from '@/types/api/windows';
import { ExcuseFrom, ExcuseStatus } from '@/types/models/excuse';
import { TableColumn } from '@/types/table';
import { formatDateWithYear } from '@/utils/dateUtils';
import {
  compareDatesAscending,
  compareNamesAscending,
} from '@/utils/sortUtils';

const getExcuseFromTags = (e: ExcuseFrom): string[] => {
  switch (e) {
    case ExcuseFrom.QUESTION:
      return ['QUESTION'];
    case ExcuseFrom.INTERVIEW:
      return ['INTERVIEW'];
    case ExcuseFrom.INTERVIEW_AND_QUESTION:
      return ['QUESTION', 'INTERVIEW'];
    default:
      return [];
  }
};

interface Props {
  excuses: ExcuseBase[];
  windows: WindowBase[];
  onDataUpdate: () => Promise<void>;
}

const getColumns = (
  onView: (id: number) => void,
  getWindowNumber: (w: WindowBase) => number,
): TableColumn[] => {
  return [
    {
      label: 'User',
      key: 'user',
      options: {
        customBodyRenderer: (user: UserBase): ReactNode => (
          <UserProfile ps={0} user={user} />
        ),
        isSearchable: false,
        isDownloadable: false,
        isSortable: true,
        customSortComparator: compareNamesAscending,
      },
    },
    {
      label: 'Window',
      key: 'window',
      options: {
        customBodyRenderer: (window: WindowBase): ReactNode => (
          <Text>{`Window ${getWindowNumber(window)}`}</Text>
        ),
        isSortable: true,
        customSortComparator: (a, b) =>
          compareDatesAscending(a.startAt, b.startAt),
      },
    },
    {
      label: 'Excuse From',
      key: 'excuseFrom',
      options: {
        customBodyRenderer: (excuseFrom: ExcuseFrom): ReactNode => {
          const tags = getExcuseFromTags(excuseFrom);
          return (
            <HStack spacing={2}>
              {tags.map((tag) => (
                <Tag
                  colorScheme={tag === ExcuseFrom.QUESTION ? 'gray' : 'purple'}
                  key={tag}
                >
                  {tag}
                </Tag>
              ))}
            </HStack>
          );
        },
        isSortable: true,
      },
    },
    {
      label: 'Excuse Reason',
      key: 'reason',
      options: {
        customBodyRenderer: (reason: string): ReactNode => (
          <div style={{ maxWidth: '150px' }}>
            <Text isTruncated={true}>{reason}</Text>
          </div>
        ),
        isSortable: true,
      },
    },
    {
      label: 'Status',
      key: 'status',
      options: {
        customBodyRenderer: (status: ExcuseStatus): ReactNode => (
          <Tag
            colorScheme={
              status === ExcuseStatus.PENDING
                ? 'gray'
                : status === ExcuseStatus.ACCEPTED
                ? 'green'
                : 'red'
            }
          >
            {status}
          </Tag>
        ),
        isSortable: true,
      },
    },
    {
      label: 'Actions',
      key: 'id',
      options: {
        customBodyRenderer: (id: number): ReactNode => (
          <Button onClick={(): void => onView(id)} variant="secondary">
            View
          </Button>
        ),
        isDownloadable: false,
        isSearchable: false,
        isVisible: true,
      },
    },
  ];
};

export const ExcuseTable = ({
  excuses,
  windows,
  onDataUpdate,
}: Props): ReactElement<Props, typeof Card> => {
  const [filter, setFilter] = useState('all');
  const filteredExcuses = excuses.filter((excuse) => {
    switch (filter) {
      case 'pending':
        return excuse.status === ExcuseStatus.PENDING;
      case 'accepted':
        return excuse.status === ExcuseStatus.ACCEPTED;
      case 'rejected':
        return excuse.status === ExcuseStatus.REJECTED;
      default:
        return true;
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExcuse, setSelectedExcuse] = useState<ExcuseBase | null>(null);
  const toast = useToast();

  const sortedWindows = useMemo(
    () =>
      structuredClone(windows).sort((a, b) =>
        compareDatesAscending(a.startAt, b.startAt),
      ),
    [windows],
  );

  const getWindowNumber = useCallback(
    (window: WindowBase): number => {
      return sortedWindows.findIndex((w: WindowBase) => w.id === window.id) + 1;
    },
    [sortedWindows],
  );

  const onView = useCallback(
    (id: number): void => {
      setIsOpen(true);
      setSelectedExcuse(excuses.find((excuse) => excuse.id === id) ?? null);
    },
    [excuses],
  );

  const onClose = (): void => {
    onDataUpdate();
    setIsOpen(false);
  };

  const onAccept = async (excuse: ExcuseBase): Promise<void> => {
    try {
      setIsLoading(true);
      await approveExcuse(excuse.id);
      await onDataUpdate();
      toast({
        ...DEFAULT_TOAST_PROPS,
        title: 'Success!',
        status: 'success',
        description: 'Excuse has been accepted successfully.',
      });
      onClose();
    } catch {
      toast(ERROR_TOAST_PROPS);
    } finally {
      setIsLoading(false);
    }
  };

  const onReject = async (excuse: ExcuseBase): Promise<void> => {
    try {
      setIsLoading(true);
      await rejectExcuse(excuse.id);
      await onDataUpdate();
      toast({
        ...DEFAULT_TOAST_PROPS,
        title: 'Success!',
        status: 'success',
        description: 'Excuse has been rejected successfully.',
      });
      onClose();
    } catch {
      toast(ERROR_TOAST_PROPS);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => getColumns(onView, getWindowNumber),
    [getWindowNumber, onView],
  );

  const isShowQuestion =
    selectedExcuse?.excuseFrom === ExcuseFrom.QUESTION ||
    selectedExcuse?.excuseFrom === ExcuseFrom.INTERVIEW_AND_QUESTION;
  const isShowInterview =
    selectedExcuse?.excuseFrom === ExcuseFrom.INTERVIEW ||
    selectedExcuse?.excuseFrom === ExcuseFrom.INTERVIEW_AND_QUESTION;

  return (
    <>
      {selectedExcuse && (
        <Modal
          actions={
            <HStack>
              <Button
                isDisabled={isLoading}
                onClick={onClose}
                variant="secondary"
              >
                Close
              </Button>
              <Button
                colorScheme="red"
                isDisabled={new Date() > selectedExcuse.window.endAt}
                isLoading={isLoading}
                onClick={(): Promise<void> => onReject(selectedExcuse)}
                variant="primary"
              >
                Reject
              </Button>
              <Button
                colorScheme="green"
                isDisabled={new Date() > selectedExcuse.window.endAt}
                isLoading={isLoading}
                onClick={(): Promise<void> => onAccept(selectedExcuse)}
                variant="primary"
              >
                Accept
              </Button>
            </HStack>
          }
          isOpen={isOpen}
          onClose={onClose}
          title="View Excuse"
        >
          <Stack spacing={5}>
            <UserProfile ps={0} user={selectedExcuse.user} />

            <FormControl>
              <FormLabel>Excuse From</FormLabel>
              <CheckboxGroup colorScheme="green">
                <HStack spacing={2}>
                  {isShowQuestion && <Tag>QUESTION</Tag>}
                  {isShowInterview && <Tag colorScheme="purple">INTERVIEW</Tag>}
                </HStack>
              </CheckboxGroup>
            </FormControl>

            <FormControl>
              <FormLabel>
                Window {getWindowNumber(selectedExcuse.window)}
              </FormLabel>
              <Text fontSize="sm">{`${formatDateWithYear(
                selectedExcuse.window.startAt,
              )} - ${formatDateWithYear(selectedExcuse.window.endAt)}`}</Text>
            </FormControl>

            <FormControl>
              <FormLabel>Excuse Reason</FormLabel>
              <Text fontSize="sm">{selectedExcuse.reason}</Text>
            </FormControl>

            <FormControl>
              <FormLabel>Current Status</FormLabel>
              {selectedExcuse.status === ExcuseStatus.ACCEPTED && (
                <Tag colorScheme="green">ACCEPTED</Tag>
              )}
              {selectedExcuse.status === ExcuseStatus.REJECTED && (
                <Tag colorScheme="red">REJECTED</Tag>
              )}
              {selectedExcuse.status === ExcuseStatus.PENDING && (
                <Tag>PENDING</Tag>
              )}
            </FormControl>
          </Stack>
        </Modal>
      )}

      <Card px={0} py={0}>
        <Table
          actionButton={
            <HStack spacing={2}>
              <HiFilter size={25} />
              <Select
                onChange={(e): void => setFilter(e.target.value)}
                value={filter}
              >
                <option value="all">All</option>
                <option value="pending">Pending Decision</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Select>
            </HStack>
          }
          columns={columns}
          options={{
            title: 'Excuses',
            isDownloadable: false,
            numRowsPerPage: excuses.length,
          }}
          rows={filteredExcuses}
        />
      </Card>
    </>
  );
};
