/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

export interface TableColumnOptions {
  customBodyRenderer?: (value: any) => string | ReactNode;
  customHeaderRenderer?: () => string | ReactNode;
  customCsvBodyRenderer?: (value: any) => string;
  customCsvHeaderRenderer?: () => string;
  /** Default is true */
  isVisible?: boolean;
  /** Default is true */
  isDownloadable?: boolean;
  /** Default is true */
  isSearchable?: boolean;
  customSearchValueRenderer?: (value: any) => string;
}

export interface TableColumn {
  label: string;
  key: string;
  options?: TableColumnOptions;
}

export interface TableOptions {
  title?: string;
  noDataMessage?: string;
  /** Default is true */
  isDownloadable?: boolean;
  /** Default is true */
  isSearchable?: boolean;
  downloadFileName?: string;
}
