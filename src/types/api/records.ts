import { RecordWithPartner } from 'types/models/record';

export interface RecordStatsEntity {
  // If currently in the middle of a window, the number will be returned
  // Else if not, it will be the number completed this week, with respect to SG time.
  numberOfRecordsForThisWindowOrWeek: number;
  // If this is null, that means the number of records is for this week. If it's non-null, then
  // the number of records is for this current window.
  requireInterview: boolean | null;
  latestRecord: RecordWithPartner | null;
  averageInterviewDurationMs: number; // In milliseconds, as the name suggests
  allRecords: RecordWithPartner[];
}
