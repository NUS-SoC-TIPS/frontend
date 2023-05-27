/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

export interface TableColumnOptions {
  /** Render a custom string or ReactNode using the cell value. */
  customBodyRenderer?: (value: any) => string | ReactNode;
  /** To render a string, use the label property on TableColumn instead. */
  customHeaderRenderer?: () => ReactNode;
  /** Default is true. */
  isVisible?: boolean;
  /** Whether the column will be exported to CSV. Default is true. Column can be downloadable even if not visible. */
  isDownloadable?: boolean;
  /** Render a custom string to export to CSV using the cell value. */
  customCsvBodyRenderer?: (value: any) => string;
  /** Render a custom column header string to export to CSV. If not provided, the column label is used. */
  customCsvHeaderRenderer?: () => string;
  /** Default is true. Column can be searchable even if not visible. */
  isSearchable?: boolean;
  /** Render a custom string representation for searching purposes. */
  customSearchValueRenderer?: (value: any) => string;
  /** Default is false. Column is not sortable if it is not visible. */
  isSortable?: boolean;
  /** If not provided, numbers will be compared as numbers and everything else will be compared as strings. */
  customSortComparator?: (a: any, b: any) => number;
}

export interface TableColumn {
  /** Label to render as the column header for both the table and the CSV download. */
  label: string;
  /** Key that is to be used to index against each row object to obtain the cell data. */
  key: string;
  /** See TableColumnOptions. */
  options?: TableColumnOptions;
}

export interface TableOptions {
  /** Default is `Table`. */
  title?: string;
  /** Message to show when no data is available. Default is `No Data`. */
  noDataMessage?: string;
  /** Whether the table supports export to CSV. Default is true. */
  isDownloadable?: boolean;
  /** Whether the table supports searching. Default is true. */
  isSearchable?: boolean;
  /** Downloaded CSV file name. Default is `Table`. No need to provide the `.csv` suffix. */
  downloadFileName?: string;
  /** Number of rows per page. Default is 5. */
  numRowsPerPage?: number;
}
