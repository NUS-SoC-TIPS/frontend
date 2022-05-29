import { ReactElement, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Stack,
  Table as ChakraTable,
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
  const [page, setPage] = useState(0);
  const maxPage = Math.max(Math.ceil(rows.length / 5) - 1, 0);
  const renderedRows = rows.slice(page * 5, (page + 1) * 5);
  const renderedColumns = columns.filter(
    (column) => column.options?.isVisible !== false,
  );

  useEffect(() => {
    if (page * 5 > maxPage) {
      setPage(maxPage);
    }
  }, [page, maxPage]);

  const getBottomMessage = (): string => {
    if (rows.length === 0) {
      return 'Showing 0 results';
    }
    const lowerNumber = page * 5 + 1;
    const upperNumber = Math.min((page + 1) * 5, rows.length);
    const results = rows.length === 1 ? 'row' : 'rows';
    return `Showing ${lowerNumber} to ${upperNumber} of ${rows.length} ${results}`;
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
    const values = rows.map((r) =>
      downloadableColumns.map((c) =>
        c.options?.customCsvBodyRenderer
          ? c.options.customCsvBodyRenderer(r[c.key])
          : String(r[c.key]),
      ),
    );
    return [headings, ...values];
  };

  return (
    <Stack spacing="5">
      <Box pt="5" px={{ base: '4', md: '6' }}>
        <Stack alignItems="center" direction="row" justify="space-between">
          <Text fontSize="lg" fontWeight="medium">
            {options?.title ?? 'Table'}
          </Text>
          {options?.isDownloadable !== false && !isMobile && (
            <CSVLink
              data={getCsvData()}
              filename={options?.downloadFileName ?? 'Table'}
            >
              <Button variant="primary">Download CSV</Button>
            </CSVLink>
          )}
        </Stack>
      </Box>
      <Box overflowX="auto">
        <ChakraTable {...props}>
          <Thead>
            <Tr>
              {renderedColumns.map((column, index) => (
                <Th key={index}>
                  {column.options?.customHeaderRenderer ? (
                    column.options.customHeaderRenderer()
                  ) : (
                    <Text>{column.label}</Text>
                  )}
                </Th>
              ))}
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
            {rows.length === 0 && (
              <>
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
              </>
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
