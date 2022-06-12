import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FiSearch } from 'react-icons/fi';
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table as ChakraTable,
  TableColumnHeaderProps,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react';

import { TableColumn, TableOptions } from 'types/table';

import { SortIcon } from './SortIcon';

interface Props extends TableProps {
  columns: TableColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  options?: TableOptions;
}

export const Table = ({
  columns,
  rows,
  options,
  ...props
}: Props): ReactElement<Props, typeof ChakraTable> => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [allRows, setAllRows] = useState(rows);
  const [page, setPage] = useState(0);
  const [sortedColumnKey, setSortedColumnKey] = useState<string | null>(null);
  const [isAscending, setIsAscending] = useState(true);
  const maxPage = Math.max(Math.ceil(allRows.length / 5) - 1, 0);

  useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, maxPage]);

  useEffect(() => {
    setAllRows(rows);
    setSortedColumnKey(null);
    setIsAscending(true);
    setPage(0);
  }, [rows]);

  const sortedRows = allRows.slice();
  if (sortedColumnKey) {
    const comparator = columns.find((column) => column.key === sortedColumnKey)
      ?.options?.customSortComparator;
    sortedRows.sort((a, b): number => {
      const valueA = a[sortedColumnKey];
      const valueB = b[sortedColumnKey];
      if (comparator) {
        const result = comparator(valueA, valueB);
        return isAscending ? result : -result;
      }
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return isAscending ? valueA - valueB : valueB - valueA;
      }
      return isAscending
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }

  const renderedRows = sortedRows.slice(page * 5, (page + 1) * 5);
  const renderedColumns = columns.filter(
    (column) => column.options?.isVisible !== false,
  );

  const getBottomMessage = (): string => {
    if (allRows.length === 0) {
      return 'Showing 0 results';
    }
    const lowerNumber = page * 5 + 1;
    const upperNumber = Math.min((page + 1) * 5, allRows.length);
    const results = allRows.length === 1 ? 'row' : 'rows';
    return `Showing ${lowerNumber} to ${upperNumber} of ${allRows.length} ${results}`;
  };

  const onPrevious = (): void => {
    if (page === 0) {
      return;
    }
    setPage(page - 1);
  };

  const onNext = (): void => {
    if (page === maxPage) {
      return;
    }
    setPage(page + 1);
  };

  const getCsvData = (): string[][] => {
    const downloadableColumns = columns.filter(
      (c) => c.options?.isDownloadable !== false,
    );
    const headings = downloadableColumns.map((c) =>
      c.options?.customCsvHeaderRenderer
        ? c.options.customCsvHeaderRenderer()
        : c.label,
    );
    const values = allRows.map((r) =>
      downloadableColumns.map((c) =>
        c.options?.customCsvBodyRenderer
          ? c.options.customCsvBodyRenderer(r[c.key])
          : String(r[c.key]),
      ),
    );
    return [headings, ...values];
  };

  const onSearch = (value: string): void => {
    const tokens = value.toLowerCase().split(' ');
    const newRows = rows.filter((row) => {
      const values = renderedColumns
        .filter((column) => column.options?.isSearchable !== false)
        .map((column) => {
          let value = row[column.key];
          if (column.options?.customSearchValueRenderer) {
            value = column.options.customSearchValueRenderer(value);
          } else if (
            typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
          ) {
            value = '';
          }
          return value;
        })
        .join('')
        .toLowerCase();
      return tokens.every((token) => values.includes(token));
    });
    setAllRows(newRows);
  };

  const renderColumnHeader = (column: TableColumn): ReactNode => {
    const isSortable = column.options?.isSortable === true;
    const headerProps: TableColumnHeaderProps = isSortable
      ? {
          cursor: 'pointer',
          onClick: (): void => {
            if (sortedColumnKey === column.key) {
              if (isAscending) {
                setIsAscending(false);
              } else {
                setSortedColumnKey(null);
              }
            } else {
              setSortedColumnKey(column.key);
              setIsAscending(true);
            }
          },
        }
      : {};
    const value = column.options?.customHeaderRenderer ? (
      column.options.customHeaderRenderer()
    ) : (
      <Text>{column.label}</Text>
    );
    return (
      <Th key={column.key} {...headerProps}>
        <Box alignItems="center" display="flex">
          {value}
          {isSortable && sortedColumnKey === column.key && (
            <SortIcon isAscending={isAscending} />
          )}
        </Box>
      </Th>
    );
  };

  return (
    <Stack spacing="5">
      <Box pt="5" px={{ base: '4', md: '6' }}>
        <Stack
          alignItems={{ base: 'stretch', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
        >
          <Text fontSize="lg" fontWeight="medium">
            {options?.title ?? 'Table'}
          </Text>
          <HStack spacing={2}>
            {options?.isDownloadable !== false && !isMobile && (
              <CSVLink
                data={getCsvData()}
                filename={options?.downloadFileName ?? 'Table'}
              >
                <Button variant="secondary">Download</Button>
              </CSVLink>
            )}
            {options?.isSearchable !== false && (
              <InputGroup maxW={{ base: '100%', md: 'xs' }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} boxSize="5" color="muted" />
                </InputLeftElement>
                <Input
                  onChange={(event): void => onSearch(event.target.value)}
                  placeholder="Search"
                />
              </InputGroup>
            )}
          </HStack>
        </Stack>
      </Box>
      <Box overflowX="auto">
        <ChakraTable {...props}>
          <Thead>
            <Tr>
              {renderedColumns.map((column) => renderColumnHeader(column))}
            </Tr>
          </Thead>
          <Tbody>
            {renderedRows.map((row, index) => (
              <Tr key={index}>
                {renderedColumns.map((column, index) => (
                  <Td key={index}>
                    {column.options?.customBodyRenderer ? (
                      column.options.customBodyRenderer(row[column.key])
                    ) : (
                      <Text>{row[column.key]}</Text>
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
            {allRows.length === 0 && (
              <Tr>
                <Td>
                  <Text color="muted">
                    {options?.noDataMessage ?? 'No Data'}
                  </Text>
                </Td>
                {Array(renderedColumns.length - 1)
                  .fill(0)
                  .map((_, index) => (
                    <Td key={index}></Td>
                  ))}
              </Tr>
            )}
          </Tbody>
        </ChakraTable>
      </Box>
      <Box pb="5" px={{ base: '4', md: '6' }}>
        <HStack justify="space-between" spacing="3">
          {!isMobile && (
            <Text color="muted" fontSize="sm">
              {getBottomMessage()}
            </Text>
          )}
          <ButtonGroup
            justifyContent="space-between"
            spacing="3"
            variant="secondary"
            width={{ base: 'full', md: 'auto' }}
          >
            <Button disabled={page === 0} onClick={onPrevious}>
              Previous
            </Button>
            <Button disabled={page === maxPage} onClick={onNext}>
              Next
            </Button>
          </ButtonGroup>
        </HStack>
      </Box>
    </Stack>
  );
};
