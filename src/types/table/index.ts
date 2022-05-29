/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

export interface TableColumnOptions {
  customBodyRenderer?: (value: any) => string | ReactNode;
  customHeaderRenderer?: () => string | ReactNode;
  customCsvBodyRenderer?: (value: any) => string;
  customCsvHeaderRenderer?: (value: any) => string;
  isVisible?: boolean;
}

export interface TableColumn {
  label: string;
  key: string;
  options?: TableColumnOptions;
}
