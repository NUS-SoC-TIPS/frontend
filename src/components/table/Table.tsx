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
  /**
   * Action button to be placed to the left of the download button (if any)
   * and search bar. Shown even in mobile view.
   */
  actionButton?: ReactNode;
  options?: TableOptions;
}

export const Table = ({
  columns,
  rows,
  actionButton,
  options,
  ...props
}: Props): ReactElement<Props, typeof ChakraTable> => {
  const isMobile = useBreakpointValue(
    { base: true, md: false },
    { ssr: false },
  );
  const [allRows, setAllRows] = useState(rows);
  const [page, setPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [sortedColumnKey, setSortedColumnKey] = useState<string | null>(null);
  const [isAscending, setIsAscending] = useState(true);

  let numRowsPerPage = options?.numRowsPerPage ?? 5;
  if (numRowsPerPage <= 0) {
    numRowsPerPage = 5;
  }
  const tokens = searchValue.toLowerCase().split(' ');
  const searchedRows =
    searchValue === ''
      ? allRows
      : allRows.filter((row) => {
          const values = columns
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

  const sortedSearchedRows = searchedRows;
  if (sortedColumnKey) {
    const comparator = columns.find((column) => column.key === sortedColumnKey)
      ?.options?.customSortComparator;
    sortedSearchedRows.sort((a, b): number => {
      const valueA = a[sortedColumnKey];
      const valueB = b[sortedColumnKey];
      if (comparator) {
        const result = comparator(valueA, valueB);
        return isAscending ? result : -result;
      }
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return isAscending ? valueA - valueB : valueB - valueA;
      }
      const stringA = String(valueA).toLocaleLowerCase();
      const stringB = String(valueB).toLocaleLowerCase();
      return isAscending
        ? stringA.localeCompare(stringB)
        : stringB.localeCompare(stringA);
    });
  }

  const maxPage = Math.max(
    Math.ceil(sortedSearchedRows.length / numRowsPerPage) - 1,
    0,
  );
  const renderedRows = sortedSearchedRows.slice(
    page * numRowsPerPage,
    (page + 1) * numRowsPerPage,
  );
  const renderedColumns = columns.filter(
    (column) => column.options?.isVisible !== false,
  );

  useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, maxPage]);

  useEffect(() => {
    setAllRows(rows);
  }, [rows]);

  const getBottomMessage = (): string => {
    if (sortedSearchedRows.length === 0) {
      return 'Showing 0 results';
    }
    const lowerNumber = page * numRowsPerPage + 1;
    const upperNumber = Math.min(
      (page + 1) * numRowsPerPage,
      sortedSearchedRows.length,
    );
    const results = sortedSearchedRows.length === 1 ? 'row' : 'rows';
    return `Showing ${lowerNumber} to ${upperNumber} of ${sortedSearchedRows.length} ${results}`;
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
    <Stack spacing={5}>
      <Box pt={5} px={{ base: 4, md: 6 }}>
        <Stack
          alignItems={{ base: 'stretch', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
        >
          <Text fontSize="lg" fontWeight="medium">
            {options?.title ?? 'Table'}
          </Text>
          <HStack spacing={2}>
            {actionButton != null ? <div>{actionButton}</div> : <></>}
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
                  <Icon as={FiSearch} boxSize={5} color="muted" />
                </InputLeftElement>
                <Input
                  onChange={(event): void => setSearchValue(event.target.value)}
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
      <Box pb={5} px={{ base: 4, md: 6 }}>
        <HStack justify="space-between" spacing={3}>
          {!isMobile && (
            <Text color="muted" fontSize="sm">
              {getBottomMessage()}
            </Text>
          )}
          <ButtonGroup
            justifyContent="space-between"
            spacing={2}
            variant="secondary"
            width={{ base: 'full', md: 'auto' }}
          >
            <Button isDisabled={page === 0} onClick={onPrevious}>
              Previous
            </Button>
            <Button isDisabled={page === maxPage} onClick={onNext}>
              Next
            </Button>
          </ButtonGroup>
        </HStack>
      </Box>
    </Stack>
  );
};
