import { RecordWithPartner } from 'types/models/record';
import { Window } from 'types/models/window';

export interface RecordStatsEntity {
  // If currently in the middle of a window, the number will be returned
  // Else if not, it will be the number completed this week, with respect to SG time.
  numberOfRecordsForThisWindowOrWeek: number;
  latestRecord: RecordWithPartner | null;
  // TODO: Look into replacing this with something more meaningful
  closestWindow: Window;
}
