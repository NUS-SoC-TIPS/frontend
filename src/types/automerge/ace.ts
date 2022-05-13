export interface ChangeEvent {
  action: 'insert' | 'remove';
  start: {
    row: number;
    column: number;
  };
  lines: string[];
}
