import { RecordStatsEntity } from 'types/api/records';
import { api } from 'utils/apiUtils';

export const getRecordStats = async (): Promise<RecordStatsEntity> => {
  const response = await api.get('records/stats');
  return response.data;
};
