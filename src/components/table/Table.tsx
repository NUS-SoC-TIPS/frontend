import { ReactElement, useState } from 'react';
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

import { TableColumn } from 'types/table';

interface Props extends TableProps {
  title: string;
  columns: TableColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  emptyMessage?: string;
}

export const Table = ({
  title,
  columns,
  rows,
  emptyMessage = 'No Data',
  ...props
}: Props): ReactElement<Props, typeof ChakraTable> => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [page, setPage] = useState(0);
  const maxPage = Math.ceil(rows.length / 5) - 1;
  const renderedRows = rows.slice(page * 5, (page + 1) * 5);

  return (
    <Stack spacing="5">
      <Box pt="5" px={{ base: '4', md: '6' }}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
        >
          <Text fontSize="lg" fontWeight="medium">
            {title}
          </Text>
        </Stack>
      </Box>
      <Box overflowX="auto">
        <ChakraTable {...props}>
          <Thead>
            <Tr>
              {columns.map((column, index) => (
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
                {columns.map((column, index) => (
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
              <Td>
                <Text color="muted">{emptyMessage}</Text>
              </Td>
            )}
          </Tbody>
        </ChakraTable>
      </Box>
      <Box pb="5" px={{ base: '4', md: '6' }}>
        <HStack justify="space-between" spacing="3">
          {!isMobile && (
            <Text color="muted" fontSize="sm">
              Showing {page * 5 + 1} to {Math.min((page + 1) * 5, rows.length)}{' '}
              of {rows.length} result{rows.length === 1 ? '' : 's'}
            </Text>
          )}
          <ButtonGroup
            justifyContent="space-between"
            spacing="3"
            variant="secondary"
            width={{ base: 'full', md: 'auto' }}
          >
            <Button
              disabled={page === 0}
              onClick={(): void => {
                if (page === 0) {
                  return;
                }
                setPage(page - 1);
              }}
            >
              Previous
            </Button>
            <Button
              disabled={page === maxPage}
              onClick={(): void => {
                if (page === maxPage) {
                  return;
                }
                setPage(page + 1);
              }}
            >
              Next
            </Button>
          </ButtonGroup>
        </HStack>
      </Box>
    </Stack>
  );
};
